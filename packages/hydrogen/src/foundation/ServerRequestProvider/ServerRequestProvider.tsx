import React, {createContext, useContext} from 'react';
import type {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';

// Context to inject current request in SSR
const RequestContextSSR = createContext<ServerComponentRequest>({
  context: {cache: new Map()},
} as ServerComponentRequest);

// Cache to inject current request in RSC
function requestCacheRSC() {
  return new Map();
}

requestCacheRSC.key = Symbol.for('HYDROGEN_REQUEST');

export function useServerRequest() {
  let request: ServerComponentRequest;
  try {
    // Context only works in SSR rendering
    request = useContext(RequestContextSSR);
  } catch (error) {
    // If normal context failed it means this is not an SSR request.
    // Try getting RSC cache instead:
    // @ts-ignore
    const cache = React.unstable_getCacheForType(requestCacheRSC);
    request = cache ? cache.get(requestCacheRSC.key) : null;
  }

  if (!request) {
    throw new Error('No ServerRequest Context found');
  }

  return request;
}

export function ServerRequestProvider({
  isRSC,
  request,
  children,
}: {
  isRSC: boolean;
  request: ServerComponentRequest;
  children: JSX.Element;
}) {
  if (isRSC) {
    // Save the request object in a React cache that is
    // scoped to this current rendering.

    // @ts-ignore
    const requestCache = React.unstable_getCacheForType(requestCacheRSC);

    requestCache.set(requestCacheRSC.key, request);

    return children;
  }

  // Use a normal provider in SSR to make the request object
  // available in the current rendering.
  return (
    <RequestContextSSR.Provider value={request}>
      {children}
    </RequestContextSSR.Provider>
  );
}
