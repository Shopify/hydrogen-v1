import React, {useMemo} from 'react';
import {useServerRequest} from '../ServerRequestProvider/index.js';

import type {ImportGlobEagerOutput} from '../../types.js';
import {RouteParamsProvider} from '../useRouteParams/RouteParamsProvider.client.js';
import {createRoutes, findRouteMatches} from '../../utilities/routes.js';

interface FileRoutesProps {
  /** The routes defined by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method. */
  routes?: ImportGlobEagerOutput;
  /** A path that's prepended to all file routes. You can modify `basePath` if you want to prefix all file routes. For example, you can prefix all file routes with a locale. */
  basePath?: string;
  /** The portion of the file route path that shouldn't be a part of the URL. You need to modify this if you want to import routes from a location other than the default `src/routes`. */
  dirPrefix?: string;
}

/**
 * The `FileRoutes` component builds a set of default Hydrogen routes based on the output provided by Vite's
 * [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method. You can have multiple
 * instances of this component to source file routes from multiple locations.
 */
export function FileRoutes({routes, basePath, dirPrefix}: FileRoutesProps) {
  const request = useServerRequest();
  const {routeRendered, serverProps} = request.ctx.router;

  if (routeRendered) return null;

  const pageRoutes = routes
    ? useMemo(
        () => createRoutes({files: routes!, basePath, dirPrefix}),
        [routes, basePath, dirPrefix]
      )
    : request.ctx.hydrogenConfig!.processedRoutes;

  const [matches, details] = findRouteMatches<React.JSXElementConstructor<any>>(
    pageRoutes,
    serverProps.pathname,
    'default'
  );

  if (!details) return null;

  const route = matches.find((route) => !!route.resource.default);

  if (route) {
    request.ctx.router.routeRendered = true;
    request.ctx.router.routeParams = details.params;
    const ServerComponent = route.resource.default;

    return (
      <RouteParamsProvider
        routeParams={details.params}
        basePath={route.basePath ?? '/'}
      >
        <ServerComponent params={details.params} {...serverProps} />
      </RouteParamsProvider>
    );
  }

  return null;
}
