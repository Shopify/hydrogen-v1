import React, {cloneElement, ReactElement} from 'react';
import {useServerRequest} from '../ServerRequestProvider';
import {matchPath} from '../../utilities/matchPath';
import {Boomerang} from '../Boomerang/Boomerang.client';

export type RouteProps = {
  path: string;
  page: ReactElement;
};

/**
 * NOTE: This is experimental and not yet documented as released. Do not use this component.
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
      <>
        {cloneElement(page, {params: match.params || {}, ...serverProps})}
        {name ? <Boomerang pageTemplate={name} /> : null}
      </>
    );
  }

  return null;
}
