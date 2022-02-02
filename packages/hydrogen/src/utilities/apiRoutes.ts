import {ImportGlobEagerOutput} from '../types';
import {matchPath} from './matchPath';
import {Logger, logServerResponse} from '../utilities/log/log';
import {ServerComponentRequest} from '../framework/Hydration/ServerComponentRequest.server';

let memoizedRoutes: Array<HydrogenApiRoute> = [];
let memoizedPages: ImportGlobEagerOutput = {};

type RouteParams = Record<string, string>;
type RequestOptions = {
  params: RouteParams;
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

export function getApiRoutesFromPages(
  pages: ImportGlobEagerOutput | undefined,
  topLevelPath = '*'
): Array<HydrogenApiRoute> {
  if (!pages || memoizedPages === pages) return memoizedRoutes;

  const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '');

  const routes = Object.keys(pages)
    .filter((key) => pages[key].api)
    .map((key) => {
      const path = key
        .replace('./pages', '')
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

export async function renderApiRoute(
  request: Request,
  route: ApiRouteMatch,
  log: Logger
): Promise<Response> {
  let response;

  try {
    response = await route.resource(request, {params: route.params});

    if (!(response instanceof Response)) {
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
    log,
    request as ServerComponentRequest,
    response.status
  );

  return response;
}
