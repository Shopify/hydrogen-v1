import React, {ReactElement} from 'react';
import {useServerRequest} from '../ServerRequestProvider';

type RouterProps = {
  children: Array<ReactElement> | ReactElement;
  serverProps: Record<string, any>;
};

export function Router({
  children,
  serverProps,
}: RouterProps): ReactElement | null {
  const request = useServerRequest();
  request.ctx.router = {
    routeRendered: false,
    serverProps,
  };

  return <>{children}</>;
}
