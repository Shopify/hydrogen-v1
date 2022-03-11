import React, {ReactElement, Children} from 'react';
import {useServerRequest} from '../ServerRequestProvider';
import {FileRoutes} from './FileRoutes';
import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {Boomerang} from '../Boomerang/Boomerang.client';
import {ServerAnalytics} from '../AnalyticEventBus/';

type RouterProps = {
  children: Array<ReactElement> | ReactElement;
  serverProps: Record<string, any>;
  fallback: ReactElement;
};

export function Router({
  children,
  fallback,
  serverProps,
}: RouterProps): ReactElement | null {
  const request = useServerRequest();
  const currentPath = new URL(request.url).pathname;
  return recurseChildren(request, serverProps, fallback, currentPath, children);
}

function recurseChildren(
  request: ServerComponentRequest,
  serverProps: Record<string, any>,
  fallback: ReactElement,
  currentPath: string,
  children: Array<ReactElement> | ReactElement
): ReactElement | null {
  for (const child of Children.toArray(children) as Array<ReactElement>) {
    if (child.type === FileRoutes) {
      const fileRoutingResult = child.type({...child.props, serverProps});
      if (fileRoutingResult)
        ServerAnalytics.pushToDatalayer({
          templateName: fileRoutingResult?.type.name,
        });
      return (
        <>
          {fileRoutingResult}
          <Boomerang pageTemplate={fileRoutingResult?.type.name} />
        </>
      );
    }
  }

  ServerAnalytics.pushToDatalayer({templateName: 'fallback'});

  return (
    <>
      {fallback}
      <Boomerang pageTemplate={'fallback'} />
    </>
  );
}
