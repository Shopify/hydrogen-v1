import React, {useEffect, useState} from 'react';
import {DATA_LOADER_PATHNAME} from '../../constants';
import {ImportGlobOutput} from '../../types';
import {matchPath} from '../../utilities/matchPath';
import {useRouteDataInternal} from '../RouteData/RouteDataProvider';
import {RouteParamsProvider} from '../useRouteParams/RouteParamsProvider.client';
import {useRouter} from './BrowserRouter.client';

export function LegacyRouter({
  initialComponent,
  initialParams,
}: {
  initialComponent: any;
  initialParams: any;
}) {
  const {location} = useRouter();
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeRoute, setActiveRoute] = useState({component: initialComponent});
  const [routeParams, setRouteParams] = useState(initialParams ?? {});
  // @ts-ignore
  const {setRouteData} = useRouteDataInternal();

  useEffect(() => {
    async function loadRoute() {
      const routes = window.__hydrogenRoutes;

      const pageRoutes = createLazyPageRoutes(routes, '*', './routes');

      const {foundRoute, foundRouteDetails} = findRoute(
        location.pathname,
        pageRoutes
      );

      if (foundRoute) {
        setRouteParams(foundRouteDetails.params);

        // TODO: Check manifest to see whether route has a data loader
        const dataResponse = await fetch(
          DATA_LOADER_PATHNAME + '?pathname=' + location.pathname
        );
        if (dataResponse.headers.get('content-type') === 'application/json') {
          setRouteData(await dataResponse.json());
        } else {
          setRouteData(await dataResponse.text());
        }

        setActiveRoute({component: (await foundRoute.component()).default});
      }
    }

    if (initialLoad) {
      setInitialLoad(false);
    } else {
      loadRoute();
    }
  }, [location]);

  const ActiveRoute = activeRoute.component;

  return (
    <RouteParamsProvider routeParams={routeParams}>
      <ActiveRoute />
    </RouteParamsProvider>
  );
}

export function findRoute(pathname: string, routes: any) {
  let foundRoute, foundRouteDetails;

  for (let i = 0; i < routes.length; i++) {
    foundRouteDetails = matchPath(pathname, routes[i]);

    if (foundRouteDetails) {
      foundRoute = routes[i];
      break;
    }
  }

  return {foundRoute, foundRouteDetails};
}

interface HydrogenRoute {
  component: any;
  path: string;
  exact: boolean;
}

export function createLazyPageRoutes(
  pages: ImportGlobOutput,
  topLevelPath = '*',
  dirPrefix: string
): HydrogenRoute[] {
  const topLevelPrefix = topLevelPath.replace('*', '').replace(/\/$/, '');

  const routes = Object.keys(pages)
    .map((key) => {
      let path = key
        .replace(dirPrefix, '')
        .replace(/\.(t|j)sx?$/, '')
        .replace(/\.server$/, '')
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
        component: pages[key],
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
