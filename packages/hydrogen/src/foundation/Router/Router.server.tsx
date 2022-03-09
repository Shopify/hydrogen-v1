import React, {ReactElement} from 'react';
import {useServerRequest} from '../ServerRequestProvider';
import {BrowserRouter} from './BrowserRouter.client';

type RouterProps = {
  children: Array<ReactElement> | ReactElement;
  serverProps: Record<string, any>;
};

export function Router({
  children,
  serverProps,
}: RouterProps): ReactElement | null {
  const request = useServerRequest();
  request.ctx.router.serverProps = serverProps;

  return (
    <BrowserRouter routeParams={request.ctx.router.routeParams}>
      {children}
    </BrowserRouter>
  );
}
