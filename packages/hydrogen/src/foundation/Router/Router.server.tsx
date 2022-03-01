import React, {ReactElement, Children} from 'react';
import {useServerRequest} from '../ServerRequestProvider';
import {FileRoutes} from './FileRoutes';
import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {Boomerang} from '../Boomerang/Boomerang.client';

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
        return (
          <>
            {fileRoutingResult}
            <Boomerang pageTemplate={fileRoutingResult.type.name} />
          </>
        );
    }

    if (child.type === Route) {
      const match = matchPath(currentPath, {
        path: child.props.path,
        exact: true,
      });

      if (match) {
        request.ctx.routeParams = match.params;
        debugger;
        return (
          <>
            {cloneElement(child.props.page, {
              params: match.useParams,
              ...serverProps,
            })}
            <Boomerang
              pageTemplate={child.props.page?.name ?? child.props.page}
            />
          </>
        );
      }
    } else if (child.props.children) {
      return recurseChildren(
        request,
        serverProps,
        fallback,
        currentPath,
        child.props.children
      );
    } else {
      if (typeof child.type === 'function') {
        return recurseChildren(
          request,
          serverProps,
          fallback,
          currentPath,
          (child.type as any)(child.props)
        );
      }
    }
  }

  const fallbackName = fallback.type.toString().match(/function ([^\(]+)/);
  return (
    <>
      {fallback}
      <Boomerang pageTemplate={fallbackName && fallbackName[1]} />
    </>
  );
}
