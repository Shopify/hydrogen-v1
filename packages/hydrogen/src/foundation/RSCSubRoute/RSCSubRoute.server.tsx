import React, {cloneElement, ReactElement} from 'react';
// import {ErrorBoundary} from 'react-error-boundary';
import {useServerRequest} from '../ServerRequestProvider';
import {RSCSubRouteClient} from './RSCSubRoute.client';

export type RSCSubRouteProps = {
  /** The state of this RSC route */
  state: any;
  /** The URL path where the route exists. The path can contain variables. For example, `/products/:handle`. */
  path: string;
  /** A reference to a React Server Component that's rendered when the route is active. */
  page: ReactElement;
};

export function RSCSubRoute({
  state,
  path,
  page,
}: RSCSubRouteProps): ReactElement {
  const request = useServerRequest();
  const {serverProps} = request.ctx.router;
  const isRSC = request.isRscRequest();
  const clientState = {
    ...state,
    pathname: `/${path}`,
    subRoute: true,
  };

  return isRSC ? (
    <RSCSubRouteClient state={clientState} isRSC={isRSC} />
  ) : (
    <RSCSubRouteClient state={clientState} isRSC={isRSC}>
      {cloneElement(page, serverProps)}
    </RSCSubRouteClient>
  );
}

// try
// 1. Render SSR
// 2. Client-side set children as init state, and bound app state
// 3. RSC takes over in useEffect (app wide rsc state)
