import React, {ReactElement} from 'react';
import {CachingStrategy} from '../../types';
import {CacheShort} from '../Cache/strategies';
// import {ErrorBoundary} from 'react-error-boundary';
import {useServerRequest} from '../ServerRequestProvider';
import {RSCSubRouteClient} from './RSCSubRoute.client';

export type RSCSubRouteProps = {
  outletName: string;
  /** The server props of this RSC route */
  serverProps: any;
  /** The state of this RSC route */
  state: any;
  cache: CachingStrategy;
  /** A reference to a React Server Component that's rendered when the route is active. */
  component: ({...componentProps}: any) => JSX.Element | undefined;
  fallback?: ReactElement;
};

export function RSCSubRoute({
  outletName,
  serverProps,
  state,
  component,
  cache,
  fallback,
}: RSCSubRouteProps) {
  // console.log('RSCSubRoute', state, component);
  const request = useServerRequest();
  const isRSC = request.isRscRequest();

  if (serverProps.outlet && component) {
    console.log('RSCSub', serverProps.outlet, serverProps.response.cache);
    serverProps.response.cache(cache);
    return component ? component(state) : null;
  } else if (isRSC) {
    console.log('RSCSub - RSC');
    return (
      <RSCSubRouteClient outletName={outletName} state={state} isRSC={isRSC} />
    );
  } else {
    console.log('RSCSub - SSR');
    return (
      <RSCSubRouteClient outletName={outletName} state={state} isRSC={isRSC}>
        {component(serverProps)}
      </RSCSubRouteClient>
    );
  }
}

export function defineRSCOutlet({
  outletName,
  component,
  dependency = [],
  cache = CacheShort(),
  fallback,
}: {
  outletName: string;
  component: ({...componentProps}: any) => JSX.Element;
  dependency?: string[];
  cache?: CachingStrategy;
  fallback?: ReactElement;
}) {
  return (serverProps: any) => {
    console.log('defineOutlet', component);

    const dependencyState = dependency.reduce(function (obj: any, key) {
      if (key in serverProps) obj[key] = serverProps[key];
      return obj;
    }, {});

    serverProps.response?.cache(cache);

    return (
      <>
        {/* @ts-ignore */}
        <RSCSubRoute
          outletName={outletName}
          serverProps={serverProps}
          state={{
            ...dependencyState,
            pathname: serverProps.pathname,
            search: serverProps.search,
            outlet: serverProps.outlet,
          }}
          cache={cache}
          component={component}
          fallback={fallback}
        />
      </>
    );
  };
}
