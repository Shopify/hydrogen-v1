import React, {createContext, ReactNode, useContext} from 'react';
import type {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';

// Context to inject current request in SSR
const RequestContext = createContext<ServerComponentRequest>({
  context: {cache: new Map()},
} as ServerComponentRequest);

// Cache to inject current request in RSC
export function requestHydrationCache() {
  return new Map();
}

requestHydrationCache.key = Symbol.for('request');

export function useServerRequest() {
  let request: ServerComponentRequest;
  try {
    // Context only works in SSR rendering
    request = useContext(RequestContext);
  } catch (error) {
    // If normal context failed it means this is not an SSR request.
    // Try getting RSC cache instead:
    // @ts-ignore
    const cache = React.unstable_getCacheForType(requestHydrationCache);
    request = cache ? cache.get(requestHydrationCache.key) : null;
  }

  if (!request) {
    throw new Error('No ServerRequest Context found');
  }

  return request;
}

export function ServerRequestProvider({
  request,
  children,
}: {
  request: ServerComponentRequest;
  children: ReactNode;
}) {
  return (
    <RequestContext.Provider value={request}>
      {children}
    </RequestContext.Provider>
  );
}
