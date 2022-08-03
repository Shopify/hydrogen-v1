import type {ImportGlobEagerOutput} from '../types.js';
import {log} from './log/log.js';
import {matchPath} from './matchPath.js';

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
  sort?: boolean;
};

export function createRoutes({
  files,
  basePath = '',
  dirPrefix = '',
  sort = false,
}: CreateRoutesParams): ResolvedHydrogenRoute[] {
  if (!basePath.startsWith('/')) basePath = '/' + basePath;

  const topLevelPrefix = basePath.replace('*', '').replace(/\/$/, '');

  const keys = Object.keys(files);

  const routes = keys.map((key) => {
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

    return {
      path: topLevelPrefix + path,
      basePath: topLevelPrefix,
      resource: files[key],
      exact,
    };
  });

  return sort
    ? [
        ...routes.filter((route) => !route.path.includes(':')),
        ...routes.filter((route) => route.path.includes(':')),
      ]
    : routes;
}

let memoizedMergedRoutes: ResolvedHydrogenRoute[];
let memoizedMergedRoutesKey: CreateRoutesParams;

export function mergeRouteSets({
  default: userRoutes,
  ...pluginRoutes
}: Record<string, CreateRoutesParams>) {
  if (!memoizedMergedRoutes || memoizedMergedRoutesKey !== userRoutes) {
    // TODO: Process routes and sort at build time
    const allRoutes = [userRoutes, ...Object.values(pluginRoutes)]
      .map(createRoutes)
      .flat()
      .sort((a, b) => {
        // Compare based on pathname
        const pathComparison = a.path.localeCompare(b.path);
        if (pathComparison !== 0) return pathComparison;

        // Similar pathname, it means this route is added in-app and via plugin
        // Prioritize the one with a Server Component first, or one provided in-app otherwise.
        if (a.resource.default) return -1;
        if (b.resource.default) return 1;
        return -1; // In-app route is always the first
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

    memoizedMergedRoutesKey = userRoutes;
    memoizedMergedRoutes = [...exactRoutes, ...dynamicRoutes];
  }

  return memoizedMergedRoutes;
}

export function findRouteMatches(
  routes: ResolvedHydrogenRoute[],
  pathname: string
) {
  let details;
  const matches = [];

  for (let i = 0; i < routes.length; i++) {
    const matchDetails = matchPath(pathname, routes[i]);
    if (matchDetails) {
      details = matchDetails;
      matches.push(routes[i]);
    } else if (details) {
      // Routes are sorted alphabetically and there could be
      // multiple matches due to plugins. Therefore, if we've
      // matched a route already in this loop, we can stop
      // checking when finding the next route that doesn't match.
      break;
    }
  }

  return [matches, details] as const;
}
