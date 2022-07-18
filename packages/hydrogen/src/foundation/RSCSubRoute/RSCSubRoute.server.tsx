import React, {cloneElement, ReactElement, Suspense} from 'react';
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
}: RSCSubRouteProps): ReactElement | null {
  const request = useServerRequest();
  const {serverProps} = request.ctx.router;

  return (
    <Suspense
      fallback={request.isRscRequest() ? null : cloneElement(page, serverProps)}
    >
      <RSCSubRouteClient
        state={{
          ...state,
          pathname: `/${path}`,
        }}
      />
    </Suspense>
  );
}
