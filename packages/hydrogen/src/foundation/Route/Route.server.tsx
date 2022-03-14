import React, {cloneElement, ReactElement, Suspense} from 'react';
import {useServerRequest} from '../ServerRequestProvider';
import {matchPath} from '../../utilities/matchPath';
import {Boomerang} from '../Boomerang/Boomerang.client';
import {RouteParamsProvider} from '../useRouteParams/RouteParamsProvider.client';

export type RouteProps = {
  /** The URL path where the route exists. The path can contain variables. For example, `/products/:handle`. */
  path: string;
  /** A reference to a React Server Component that's rendered when the route is active. */
  page: ReactElement;
};

/**
 * The `Route` component is used to set up a route in Hydrogen that's independent of the file system. Routes are
 * matched in the order that they're defined. Only one route renders at a time. Use `path="*"`
 * with the last defined `<Route>` to implement a fallback mechanism on a "Not Found" page.
 */
export function Route({path, page}: RouteProps): ReactElement | null {
  const request = useServerRequest();
  const {routeRendered, serverProps} = request.ctx.router;

  if (routeRendered) return null;

  if (path === '*') {
    request.ctx.router.routeRendered = true;
    return cloneElement(page, serverProps);
  }

  const match = matchPath(serverProps.pathname, {
    path,
    exact: true,
  });

  if (match) {
    request.ctx.router.routeRendered = true;
    request.ctx.router.routeParams = match.params;
    const name = (page?.type as any)?.name;

    return (
      <RouteParamsProvider routeParams={match.params}>
        <Suspense fallback={null}>
          {cloneElement(page, {params: match.params || {}, ...serverProps})}
          {name ? <Boomerang pageTemplate={name} /> : null}
        </Suspense>
      </RouteParamsProvider>
    );
  }

  return null;
}
