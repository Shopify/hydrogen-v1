import {ImportGlobEagerOutput, ShopifyConfig} from '../types';
import {matchPath} from './matchPath';
import {getLoggerWithContext, logServerResponse} from '../utilities/log/';
import type {ServerComponentRequest} from '../framework/Hydration/ServerComponentRequest.server';
import type {ASTNode} from 'graphql';
import {fetchBuilder, graphqlRequestBody} from './fetch';
import {getStorefrontApiRequestHeaders} from './storefrontApi';
import {
  emptySessionImplementation,
  SessionApi,
  SessionStorageAdapter,
} from '../foundation/session/session';

let memoizedRoutes: Array<HydrogenApiRoute> = [];
let memoizedPages: ImportGlobEagerOutput = {};

type RouteParams = Record<string, string>;
type RequestOptions = {
  params: RouteParams;
  queryShop: (args: QueryShopArgs) => Promise<any>;
  session: SessionApi | null;
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
  pages: ImportGlobEagerOutput | undefined,
  topLevelPath = '*'
): Array<HydrogenApiRoute> {
  if (!pages || memoizedPages === pages) return memoizedRoutes;

  const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '');

  const routes = Object.keys(pages)
    .filter((key) => pages[key].api)
    .map((key) => {
      let path = key
        .replace('./routes', '')
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
        resource: pages[key].api,
        hasServerComponent: !!pages[key].default,
        exact,
      };
    });

  memoizedRoutes = [
    ...routes.filter((route) => !route.path.includes(':')),
    ...routes.filter((route) => route.path.includes(':')),
  ];

  memoizedPages = pages;

  return memoizedRoutes;
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
}

function queryShopBuilder(
  shopifyConfig: ShopifyConfig,
  request: ServerComponentRequest
) {
  return async function queryShop<T>({
    query,
    variables,
  }: QueryShopArgs): Promise<T> {
    const {storeDomain, storefrontApiVersion, storefrontToken} = shopifyConfig;
    const buyerIp = request.getBuyerIp();

    const extraHeaders = getStorefrontApiRequestHeaders({
      buyerIp,
      storefrontToken,
    });

    const fetcher = fetchBuilder<T>(
      `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`,
      {
        method: 'POST',
        body: graphqlRequestBody(query, variables),
        headers: {
          'Content-Type': 'application/json',
          ...extraHeaders,
        },
      }
    );

    return await fetcher();
  };
}

export async function renderApiRoute(
  request: ServerComponentRequest,
  route: ApiRouteMatch,
  shopifyConfig: ShopifyConfig,
  session?: SessionStorageAdapter
): Promise<Response | Request> {
  let response;
  const log = getLoggerWithContext(request);
  let cookieToSet = '';

  try {
    response = await route.resource(request, {
      params: route.params,
      queryShop: queryShopBuilder(shopifyConfig, request),
      session: session
        ? {
            async get() {
              return session.get(request);
            },
            async set(key: string, value: string) {
              const data = await session.get(request);
              data[key] = value;
              cookieToSet = await session.set(request, data);
            },
            async destroy() {
              cookieToSet = await session.destroy(request);
            },
          }
        : emptySessionImplementation(log),
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

    if (!response) {
      response = new Response(null);
    }

    if (cookieToSet) {
      response.headers.set('Set-Cookie', cookieToSet);
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
