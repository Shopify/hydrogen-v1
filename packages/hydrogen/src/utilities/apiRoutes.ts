import {
  HydrogenConfig,
  HydrogenConfigRoutes,
  ImportGlobEagerOutput,
} from '../types';
import {matchPath} from './matchPath';
import {getLoggerWithContext, logServerResponse} from '../utilities/log/';
import {ServerComponentRequest} from '../framework/Hydration/ServerComponentRequest.server';
import type {ASTNode} from 'graphql';
import {fetchBuilder, graphqlRequestBody} from './fetch';
import {findRoutePrefix} from './findRoutePrefix';

let memoizedApiRoutes: Array<HydrogenApiRoute> = [];
let memoizedRawRoutes: ImportGlobEagerOutput = {};

type RouteParams = Record<string, string>;
type RequestOptions = {
  params: RouteParams;
  queryShop: (args: QueryShopArgs) => Promise<any>;
};
type ResourceGetter = (
  request: Request,
  requestOptions: RequestOptions
) => Promise<Response | Object | String>;

interface HydrogenApiRoute {
  path: string;
  resource: ResourceGetter;
  hasServerComponent: boolean;
}

export type ApiRouteMatch = {
  resource: ResourceGetter;
  hasServerComponent: boolean;
  params: RouteParams;
};

export function getApiRoutes(
  rawRoutes: HydrogenConfigRoutes
): Array<HydrogenApiRoute> {
  const routes = (rawRoutes.files ?? rawRoutes) as ImportGlobEagerOutput;
  const topLevelPath = (rawRoutes.basePath ?? '*') as string;
  const dirPrefix = rawRoutes.dirPrefix as string | undefined;

  if (!routes || memoizedRawRoutes === routes) return memoizedApiRoutes;

  const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '');

  const keys = Object.keys(routes);
  const commonRoutePrefix = dirPrefix ?? findRoutePrefix(keys);

  const apiRoutes = keys
    .filter((key) => routes[key].api)
    .map((key) => {
      let path = key
        .replace(commonRoutePrefix, '')
        .replace(/\.server\.(t|j)sx?$/, '')
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, '/')
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(
          /\[(?:[.]{3})?(\w+?)\]/g,
          (_match, param: string) => `:${param}`
        );

      if (path.endsWith('/') && path !== '/')
        path = path.substring(0, path.length - 1);

      /**
       * Catch-all routes [...handle].jsx don't need an exact match
       * https://reactrouter.com/core/api/Route/exact-bool
       */
      const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key);

      return {
        path: topLevelPrefix + path,
        resource: routes[key].api,
        hasServerComponent: !!routes[key].default,
        exact,
      };
    });

  memoizedApiRoutes = [
    ...apiRoutes.filter((route) => !route.path.includes(':')),
    ...apiRoutes.filter((route) => route.path.includes(':')),
  ];

  memoizedRawRoutes = routes;

  return memoizedApiRoutes;
}

export function getApiRouteFromURL(
  url: URL,
  routes: Array<HydrogenApiRoute>
): ApiRouteMatch | null {
  let foundRoute, foundRouteDetails;

  for (let i = 0; i < routes.length; i++) {
    foundRouteDetails = matchPath(url.pathname, routes[i]);

    if (foundRouteDetails) {
      foundRoute = routes[i];
      break;
    }
  }

  if (!foundRoute) return null;

  return {
    resource: foundRoute.resource,
    params: foundRouteDetails.params,
    hasServerComponent: foundRoute.hasServerComponent,
  };
}

/** The `queryShop` utility is a function that helps you query the Storefront API.
 * It's similar to the `useShopQuery` hook, which is available in server components.
 * To use `queryShop`, pass `shopifyConfig` to `renderHydrogen` inside `App.server.jsx`.
 */
interface QueryShopArgs {
  /** A string of the GraphQL query.
   * If no query is provided, then the `useShopQuery` makes no calls to the Storefront API.
   */
  query: ASTNode | string;
  /** An object of the variables for the GraphQL query. */
  variables?: Record<string, any>;
  /** A string corresponding to a valid locale identifier like `en-us` used to make the request. */
  locale?: string;
}

function queryShopBuilder(
  shopifyConfigGetter: HydrogenConfig['shopify'],
  request: Request
) {
  return async function queryShop<T>({
    query,
    variables,
    locale,
  }: QueryShopArgs): Promise<T> {
    const shopifyConfig =
      typeof shopifyConfigGetter === 'function'
        ? await shopifyConfigGetter(new URL(request.url), request)
        : shopifyConfigGetter;

    const {storeDomain, storefrontApiVersion, storefrontToken, defaultLocale} =
      shopifyConfig;

    const fetcher = fetchBuilder<T>(
      `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`,
      {
        method: 'POST',
        body: graphqlRequestBody(query, variables),
        headers: {
          'X-Shopify-Storefront-Access-Token': storefrontToken,
          'Accept-Language': (locale as string) ?? defaultLocale,
          'Content-Type': 'application/json',
        },
      }
    );

    return await fetcher();
  };
}

export async function renderApiRoute(
  request: Request,
  route: ApiRouteMatch,
  shopifyConfig: HydrogenConfig['shopify']
): Promise<Response | Request> {
  let response;
  const log = getLoggerWithContext(request);

  try {
    response = await route.resource(request, {
      params: route.params,
      queryShop: queryShopBuilder(shopifyConfig, request),
    });

    if (!(response instanceof Response || response instanceof Request)) {
      if (typeof response === 'string' || response instanceof String) {
        response = new Response(response as string);
      } else if (typeof response === 'object') {
        response = new Response(JSON.stringify(response), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }
  } catch (e) {
    log.error(e);
    response = new Response('Error processing: ' + request.url, {status: 500});
  }

  logServerResponse(
    'api',
    request as ServerComponentRequest,
    (response as Response).status ?? 200
  );

  return response;
}
