import React, {useMemo} from 'react';
import {matchPath} from '../../utilities/matchPath';
import {log} from '../../utilities/log';
import {useServerRequest} from '../ServerRequestProvider';

import type {ImportGlobEagerOutput} from '../../types';

/**
 * Build a set of default Hydrogen routes based on the output provided by Vite's
 * import.meta.globEager method.
 *
 * @see https://vitejs.dev/guide/features.html#glob-import
 */
export function FileRoutes({
  routes,
  basePath = '/',
  dirPrefix = './routes',
}: {
  routes: ImportGlobEagerOutput;
  basePath?: string;
  dirPrefix?: string;
}) {
  const request = useServerRequest();
  const {routeRendered, serverProps} = request.ctx.router;

  if (routeRendered) return null;

  const pageRoutes = useMemo(
    () => createPageRoutes(routes, basePath, dirPrefix),
    [routes, basePath]
  );

  let foundRoute, foundRouteDetails;

  for (let i = 0; i < pageRoutes.length; i++) {
    foundRouteDetails = matchPath(serverProps.pathname, pageRoutes[i]);

    if (foundRouteDetails) {
      foundRoute = pageRoutes[i];
      break;
    }
  }

  if (foundRoute) {
    request.ctx.router.routeRendered = true;
    request.ctx.router.routeParams = foundRouteDetails.params;
    return (
      <foundRoute.component
        params={foundRouteDetails.params}
        {...serverProps}
      />
    );
  }

  return null;
}

interface HydrogenRoute {
  component: any;
  path: string;
  exact: boolean;
}

export function createPageRoutes(
  pages: ImportGlobEagerOutput,
  topLevelPath = '*',
  dirPrefix: string
): HydrogenRoute[] {
  const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '');

  const routes = Object.keys(pages)
    .map((key) => {
      let path = key
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

      if (!pages[key].default && !pages[key].api) {
        log?.warn(
          `${key} doesn't export a default React component or an API function`
        );
      }

      return {
        path: topLevelPrefix + path,
        component: pages[key].default,
        exact,
      };
    })
    .filter((route) => route.component);

  /**
   * Place static paths BEFORE dynamic paths to grant priority.
   */
  return [
    ...routes.filter((route) => !route.path.includes(':')),
    ...routes.filter((route) => route.path.includes(':')),
  ];
}
