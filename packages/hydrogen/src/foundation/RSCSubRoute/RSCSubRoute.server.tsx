import React, {ReactElement} from 'react';
import {CachingStrategy} from '../../types';
import {CacheShort} from '../Cache/strategies';
// import {ErrorBoundary} from 'react-error-boundary';
import {useServerRequest} from '../ServerRequestProvider';
import {RSCSubRouteClient} from './RSCSubRoute.client';

export type RSCSubRouteProps = {
  section: string;
  /** The server props of this RSC route */
  serverProps: any;
  /** The state of this RSC route */
  state: any;
  /** A reference to a React Server Component that's rendered when the route is active. */
  component: ({...componentProps}: any) => JSX.Element | undefined;
  fallback?: ReactElement;
};

export function RSCSubRoute({
  section,
  serverProps,
  state,
  component,
  fallback,
}: RSCSubRouteProps) {
  // console.log('RSCSubRoute', state, component);
  const request = useServerRequest();
  const isRSC = request.isRscRequest();

  if (serverProps.section && component) {
    console.log('RSCSub - RSC', serverProps.section);
    return component ? component(state) : null;
  } else if (isRSC) {
    console.log('RSCSub - nested RSC');
    return <RSCSubRouteClient section={section} state={state} isRSC={isRSC} />;
  } else {
    console.log('RSCSub - SSR');
    return (
      <RSCSubRouteClient section={section} state={state} isRSC={isRSC}>
        {component(serverProps)}
      </RSCSubRouteClient>
    );
  }
}

export function defineSection({
  section,
  component,
  dependency = [],
  cache = CacheShort(),
  fallback,
}: {
  section: string;
  component: ({...componentProps}: any) => JSX.Element;
  dependency?: string[];
  cache?: CachingStrategy;
  fallback?: ReactElement;
}) {
  return (serverProps: any) => {
    // serverProps only exist when rendering RSC
    console.log('defineSection', serverProps.section, component);

    const dependencyState = dependency.reduce(function (obj: any, key) {
      if (key in serverProps) obj[key] = serverProps[key];
      return obj;
    }, {});

    serverProps.response?.cache(cache);

    return (
      <>
        {/* @ts-ignore */}
        <RSCSubRoute
          section={section}
          serverProps={serverProps}
          state={{
            ...dependencyState,
            pathname: serverProps.pathname,
            search: serverProps.search,
            section: serverProps.section,
          }}
          component={component}
          fallback={fallback}
        />
      </>
    );
  };
}
