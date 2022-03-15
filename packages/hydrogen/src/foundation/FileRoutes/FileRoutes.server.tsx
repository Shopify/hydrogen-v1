import React, {useMemo} from 'react';
import {matchPath} from '../../utilities/matchPath';
import {log} from '../../utilities/log';
import {useServerRequest} from '../ServerRequestProvider';

import type {ImportGlobEagerOutput} from '../../types';
import {RouteParamsProvider} from '../useRouteParams/RouteParamsProvider.client';

interface FileRoutesProps {
  /** The routes defined by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method. */
  routes: ImportGlobEagerOutput;
  /** A path that's prepended to all file routes. You can modify `basePath` if you want to prefix all file routes. For example, you can prefix all file routes with a locale. */
  basePath?: string;
  /** The portion of the file route path that shouldn't be a part of the URL. You need to modify this if you want to import routes from a location other than the default `src/routes`. */
  dirPrefix?: string;
}

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
}: FileRoutesProps) {
  const request = useServerRequest();
  const {routeRendered, serverProps} = request.ctx.router;

  const pageRoutes = useMemo(
    () => createPageRoutes(routes, basePath, dirPrefix, routeRendered),
    [routes, basePath, dirPrefix, routeRendered]
  );

  if (!pageRoutes) return null;

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
      <RouteParamsProvider routeParams={foundRouteDetails.params}>
        <foundRoute.component
          params={foundRouteDetails.params}
          {...serverProps}
        />
      </RouteParamsProvider>
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
  dirPrefix: string,
  routeRendered: boolean
): HydrogenRoute[] | undefined {
  if (routeRendered) return;

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
