import type {SetOptional} from 'type-fest';
import type {ImportGlobEagerOutput, ResolvedHydrogenRoutes} from '../types';
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

export type HydrogenProcessedRoute = {
  path: string;
  basePath: string;
  resource: Record<string, Function>;
  exact: boolean;
};

const memoizedRoutesMap = new WeakMap<
  ImportGlobEagerOutput,
  HydrogenProcessedRoute[]
>();

export function createRoutes({
  files,
  basePath = '',
  dirPrefix = '',
}: SetOptional<
  ResolvedHydrogenRoutes,
  'basePath' | 'dirPrefix'
>): HydrogenProcessedRoute[] {
  const memoizedRoutes = memoizedRoutesMap.get(files);
  if (memoizedRoutes) return memoizedRoutes;

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

  const processedRoutes = [
    ...routes.filter((route) => !route.path.includes(':')),
    ...routes.filter((route) => route.path.includes(':')),
  ];

  memoizedRoutesMap.set(files, processedRoutes);

  return processedRoutes;
}

export function findRoute<T>(
  routes: HydrogenProcessedRoute[],
  pathname: string,
  resourceName: string
) {
  let route, details;

  for (let i = 0; i < routes.length; i++) {
    if (!routes[i].resource[resourceName]) continue;

    details = matchPath(pathname, routes[i]) as Record<string, any>;

    if (details) {
      route = routes[i];
      break;
    }
  }

  return {
    route,
    resource: route?.resource[resourceName] as T | undefined,
    details: details ?? {},
  };
}
