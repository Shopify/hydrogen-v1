import {ResolvedHydrogenConfig} from '../types.js';
import {
  getLoggerWithContext,
  logServerResponse,
} from '../utilities/log/index.js';
import type {HydrogenRequest} from '../foundation/HydrogenRequest/HydrogenRequest.server.js';
import {fetchBuilder, graphqlRequestBody} from './fetch.js';
import {getStorefrontApiRequestHeaders} from './storefrontApi.js';
import type {
  SessionApi,
  SessionStorageAdapter,
} from '../foundation/session/session-types.js';
import {emptySessionImplementation} from '../foundation/session/session.js';
import {UseShopQueryResponse} from '../hooks/useShopQuery/hooks.js';
import {RSC_PATHNAME} from '../constants.js';
import type {RouteMatches} from './routes.js';

type RouteParams = Record<string, string>;
export type RequestOptions = {
  params: RouteParams;
  queryShop: <T>(args: QueryShopArgs) => Promise<UseShopQueryResponse<T>>;
  session: SessionApi | null;
  hydrogenConfig: ResolvedHydrogenConfig;
};
export type ResourceGetter = (
  request: HydrogenRequest,
  requestOptions: RequestOptions
) => Promise<Response | Object | String>;

export type ApiRouteMatch = {
  resource: ResourceGetter;
  params: RouteParams;
};

export function getApiRouteFromURL(
  {matches, details}: RouteMatches,
  method: string
): ApiRouteMatch | null {
  const route = matches.find((route) => !!route.resource.api);

  if (
    !route ||
    !details ||
    (method === 'GET' && matches.some((routes) => !!routes.resource.default))
  ) {
    return null;
  }

  return {
    resource: route.resource.api as ResourceGetter,
    params: details.params,
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
  let response: any;
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
    response = new Response('Error processing: ' + request.url, {
      status: 500,
    });
  }

  if (!suppressLog) {
    logServerResponse(
      'api',
      request as HydrogenRequest,
      (response as Response).status ?? 200
    );
  }

  if (response instanceof Request) {
    const url = new URL(request.url);
    const newUrl = new URL(response.url, url);

    if (request.headers.get('Hydrogen-Client') === 'Form-Action') {
      response.headers.set(
        'Hydrogen-RSC-Pathname',
        newUrl.pathname + newUrl.search
      );
      return new Request(getRscUrl(url, newUrl), {
        headers: response.headers,
      });
    } else {
      // This request was made by a native form presumably because the client components had yet to hydrate,
      // Because of this, we need to redirect instead of just rendering the response.
      // Doing so prevents odd refresh / back behavior. The redirect response also should *never* be cached.
      response.headers.set('Location', newUrl.href);
      response.headers.set('Cache-Control', 'no-store');

      return new Response(null, {
        status: 303,
        headers: response.headers,
      });
    }
  }

  return response;
}

function getRscUrl(currentUrl: URL, newUrl: URL) {
  const rscUrl = new URL(RSC_PATHNAME, currentUrl);
  const searchParams = new URLSearchParams({
    state: JSON.stringify({
      pathname: newUrl.pathname,
      search: newUrl.search,
    }),
  });
  rscUrl.search = searchParams.toString();
  return rscUrl.toString();
}
