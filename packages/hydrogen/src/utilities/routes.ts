import type {ImportGlobEagerOutput} from '../types.js';
import {log} from './log/log.js';
import {matchPath, RouteMatchDetails} from './matchPath.js';

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

export type ResolvedHydrogenRoute = {
  path: string;
  basePath: string;
  resource: Record<string, Function>;
  exact: boolean;
};

type CreateRoutesParams = {
  files: ImportGlobEagerOutput;
  dirPrefix?: string;
  basePath?: string;
};

const allMemoizedRoutes = new WeakMap<
  ImportGlobEagerOutput,
  ResolvedHydrogenRoute[]
>();

export function createRoutes({
  files,
  basePath = '',
  dirPrefix = '',
}: CreateRoutesParams): ResolvedHydrogenRoute[] {
  if (!__HYDROGEN_DEV__) {
    const memoizedRoutes = allMemoizedRoutes.get(files);
    if (memoizedRoutes) return memoizedRoutes;
  }

  if (!basePath.startsWith('/')) basePath = '/' + basePath;
  const topLevelPrefix = basePath.replace('*', '').replace(/\/$/, '');

  const keys = Object.keys(files);

  const allRoutes = keys.map((key) => {
    const path = extractPathFromRoutesKey(key, dirPrefix);

    /**
     * Catch-all routes [...handle].jsx don't need an exact match
     * https://reactrouter.com/core/api/Route/exact-bool
     */
    const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key);

    if (!files[key].default && !files[key].api) {
      log?.warn(
        `${key} doesn't export a default React component or an API function`
      );
    }

    const result = {
      path: topLevelPrefix + path,
      basePath: topLevelPrefix,
      resource: files[key],
      exact,
    } as ResolvedHydrogenRoute;

    return result;
  });

  const exactRoutes = [];
  const dynamicRoutes = [];

  for (const route of allRoutes) {
    if (route.path.includes(':')) {
      dynamicRoutes.push(route);
    } else {
      exactRoutes.push(route);
    }
  }

  const sortedRoutes = [...exactRoutes, ...dynamicRoutes];
  allMemoizedRoutes.set(files, sortedRoutes);

  return sortedRoutes;
}

export type RouteMatches = {
  match?: ResolvedHydrogenRoute;
  details?: RouteMatchDetails;
};

export function findRouteMatches(
  routes: ResolvedHydrogenRoute[],
  pathname: string
): RouteMatches {
  let details, match;

  for (const route of routes) {
    const matchDetails = matchPath(pathname, route);
    if (matchDetails) {
      details = matchDetails;
      match = route;
      break;
    }
  }

  return {match, details};
}
