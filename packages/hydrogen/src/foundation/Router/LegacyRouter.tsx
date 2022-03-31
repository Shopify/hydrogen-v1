import React, {useContext, useEffect, useState, createContext} from 'react';
import {DATA_LOADER_PATHNAME} from '../../constants';
import {ImportGlobOutput} from '../../types';
import {matchPath} from '../../utilities/matchPath';
import {RouteParamsProvider} from '../useRouteParams/RouteParamsProvider.client';
import {useRouter} from './BrowserRouter.client';

// @ts-ignore
globalThis.__routeDataContext ||= createContext<any>(null);
// @ts-ignore
const RouteDataContext = globalThis.__routeDataContext;

export function LegacyRouter({
  initialComponent,
  initialParams,
  initialData,
}: {
  initialComponent: any;
  initialParams: any;
  initialData: any;
}) {
  const {location} = useRouter();
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeRoute, setActiveRoute] = useState({
    component: initialComponent,
    data: initialData,
  });
  const [routeParams, setRouteParams] = useState(initialParams ?? {});

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
        let data;
        if (dataResponse.headers.get('content-type') === 'application/json') {
          data = await dataResponse.json();
        } else {
          data = await dataResponse.text();
        }

        setActiveRoute({
          component: (await foundRoute.component()).default,
          data,
        });
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
      <RouteDataContext.Provider value={activeRoute.data}>
        <ActiveRoute />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__hydrogenRouteData = ${JSON.stringify(
              initialData
            )}`,
          }}
        ></script>
      </RouteDataContext.Provider>
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

export function useRouteData() {
  return useContext(RouteDataContext);
}
