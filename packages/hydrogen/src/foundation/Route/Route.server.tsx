import React, {cloneElement, ReactElement} from 'react';
import {useServerRequest} from '../ServerRequestProvider';
import {matchPath} from '../../utilities/matchPath';
import {Boomerang} from '../Boomerang/Boomerang.client';
import {RouteParamsProvider} from '../useParams/RouteParamsProvider.client';

export type RouteProps = {
  /** The URL path the route exists at. Can contain variables: `/products/:handle`. */
  path: string;
  /** A reference to a React Server Component that will be rendered when the route is active. */
  page: ReactElement;
};

/**
 * `<Route>` is used to setup a hydrogen Route independent of the file system. Rotues are matched
 * in the order that they are defined. Only _one_ route will render at a time. Use `path="*"`
 * with the last defined `<Route>` to fallback render a not found page.
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
        {cloneElement(page, {params: match.params || {}, ...serverProps})}
        {name ? <Boomerang pageTemplate={name} /> : null}
      </RouteParamsProvider>
    );
  }

  return null;
}
