import React, {ReactElement, Children, cloneElement} from 'react';
import {useServerRequest} from '../ServerRequestProvider';
import {Route} from './Route.server';
import {DefaultRoutes} from './DefaultRoutes';
import {matchPath} from '../../utilities/matchPath';
import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {BoomerangPage} from '../Boomerang/BoomerangPageTemplate.client';
import {Boomerang} from '../Boomerang/Boomerang.client';

type RouterProps = {
  children: Array<ReactElement> | ReactElement;
  serverState: Record<string, any>;
  fallback: ReactElement;
};

export function Router({
  children,
  fallback,
  serverState,
}: RouterProps): ReactElement | null {
  const request = useServerRequest();
  const currentPath = new URL(request.url).pathname;
  return recurseChildren(request, serverState, fallback, currentPath, children);
}

function recurseChildren(
  request: ServerComponentRequest,
  serverState: Record<string, any>,
  fallback: ReactElement,
  currentPath: string,
  children: Array<ReactElement> | ReactElement
): ReactElement | null {
  for (const child of Children.toArray(children) as Array<ReactElement>) {
    if (child.type === DefaultRoutes) {
      const fileRoutingResult = child.type({...child.props, serverState}); // grevious hack?
      if (fileRoutingResult)
        return (
          <>
            {fileRoutingResult}
            <Boomerang />
            <BoomerangPage
              pageTemplate={child.props.page?.name ?? child.props.page}
            />
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
              ...serverState,
            })}
            <Boomerang />
            <BoomerangPage
              pageTemplate={child.props.page?.name ?? child.props.page}
            />
          </>
        );
      }
    } else if (child.props.children) {
      return recurseChildren(
        request,
        serverState,
        fallback,
        currentPath,
        child.props.children
      );
    } else {
      if (typeof child.type === 'function') {
        return recurseChildren(
          request,
          serverState,
          fallback,
          currentPath,
          (child.type as any)(child.props) // is this a grevious hack?
        );
      }
    }
  }

  return (
    <>
      {fallback}
      <Boomerang />
      <BoomerangPage
        pageTemplate={fallback.props.page?.name ?? fallback.props.page}
      />
    </>
  );
}
