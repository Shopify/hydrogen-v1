import {
  ResolvedHydrogenConfig,
  ResolvedHydrogenRoutes,
  ImportGlobEagerOutput,
} from '../types';
import {matchPath} from './matchPath';
import {getLoggerWithContext, logServerResponse} from '../utilities/log/';
import type {HydrogenRequest} from '../foundation/HydrogenRequest/HydrogenRequest.server';
import {fetchBuilder, graphqlRequestBody} from './fetch';
import {getStorefrontApiRequestHeaders} from './storefrontApi';
import {
  emptySessionImplementation,
  SessionApi,
  SessionStorageAdapter,
} from '../foundation/session/session';

let memoizedApiRoutes: Array<HydrogenApiRoute> = [];
let memoizedRawRoutes: ImportGlobEagerOutput = {};

type RouteParams = Record<string, string>;
export type RequestOptions = {
  params: RouteParams;
  queryShop: (args: QueryShopArgs) => Promise<any>;
  session: SessionApi | null;
  hydrogenConfig: ResolvedHydrogenConfig;
};
export type ResourceGetter = (
  request: HydrogenRequest,
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

export function extractPathFromRoutesKey(
  routesKey: string,
  dirPrefix: string | RegExp
) {
  let path = routesKey
    .replace(dirPrefix, '')
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
    .replace(/\[(?:[.]{3})?(\w+?)\]/g, (_match, param: string) => `:${param}`);

  if (path.endsWith('/') && path !== '/') {
    path = path.substring(0, path.length - 1);
  }

  return path;
}

export function getApiRoutes({
  files: routes,
  basePath: topLevelPath = '',
  dirPrefix = '',
}: Partial<ResolvedHydrogenRoutes>): Array<HydrogenApiRoute> {
  if (!routes || memoizedRawRoutes === routes) return memoizedApiRoutes;

  const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '');

  const keys = Object.keys(routes);

  const apiRoutes = keys
    .filter((key) => routes[key].api)
    .map((key) => {
      const path = extractPathFromRoutesKey(key, dirPrefix);

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
  query: string;
  /** An object of the variables for the GraphQL query. */
  variables?: Record<string, any>;
}

function queryShopBuilder(
  shopifyConfigGetter: ResolvedHydrogenConfig['shopify'],
  request: HydrogenRequest
) {
  return async function queryShop<T>({
    query,
    variables,
  }: QueryShopArgs): Promise<T> {
    const shopifyConfig =
      typeof shopifyConfigGetter === 'function'
        ? await shopifyConfigGetter(request)
        : shopifyConfigGetter;

    if (!shopifyConfig) {
      throw new Error(
        'Shopify connection info was not found in Hydrogen config'
      );
    }

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
  request: HydrogenRequest,
  route: ApiRouteMatch,
  hydrogenConfig: ResolvedHydrogenConfig,
  {
    session,
    suppressLog,
  }: {
    session?: SessionStorageAdapter;
    suppressLog?: boolean;
  }
): Promise<Response | Request> {
  let response;
  const log = getLoggerWithContext(request);
  let cookieToSet = '';

  try {
    response = await route.resource(request, {
      params: route.params,
      queryShop: queryShopBuilder(hydrogenConfig.shopify, request),
      hydrogenConfig,
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

  if (!suppressLog) {
    logServerResponse(
      'api',
      request as HydrogenRequest,
      (response as Response).status ?? 200
    );
  }

  return response;
}
