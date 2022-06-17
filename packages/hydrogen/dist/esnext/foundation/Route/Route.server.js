import React, { cloneElement } from 'react';
import { useServerRequest } from '../ServerRequestProvider';
import { matchPath } from '../../utilities/matchPath';
import { RouteParamsProvider } from '../useRouteParams/RouteParamsProvider.client';
/**
 * The `Route` component is used to set up a route in Hydrogen that's independent of the file system. Routes are
 * matched in the order that they're defined.
 */
export function Route({ path, page }) {
    const request = useServerRequest();
    const { routeRendered, serverProps } = request.ctx.router;
    if (routeRendered)
        return null;
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
        return (React.createElement(RouteParamsProvider, { routeParams: match.params }, cloneElement(page, { params: match.params || {}, ...serverProps })));
    }
    return null;
}
