import React, {createContext, useContext} from 'react';
import {hashKey} from '../../framework/cache';
import type {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import type {QueryKey} from '../../types';

// Context to inject current request in SSR
const RequestContextSSR = createContext<ServerComponentRequest | null>(null);

// Cache to inject current request in RSC
function requestCacheRSC() {
  return new Map();
}

requestCacheRSC.key = Symbol.for('HYDROGEN_REQUEST');

type ServerRequestProviderProps = {
  isRSC: boolean;
  request: ServerComponentRequest;
  children: JSX.Element;
};

export function ServerRequestProvider({
  isRSC,
  request,
  children,
}: ServerRequestProviderProps) {
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

export function useServerRequest() {
  let request: ServerComponentRequest | null;
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

type RequestCacheResult<T> =
  | {data: T; error?: never} // success
  | {data?: never; error: Response}; // failure

/**
 * Returns data stored in the request cache.
 * It will throw the promise if data is not ready.
 */
export function useRequestCacheData<T>(
  key: QueryKey,
  fetcher: () => Promise<T>
): RequestCacheResult<T> {
  const {cache} = useServerRequest().ctx;
  const cacheKey = hashKey(key);

  if (!cache.has(cacheKey)) {
    let data: RequestCacheResult<T>;
    let promise: Promise<RequestCacheResult<T>>;

    cache.set(cacheKey, () => {
      if (data !== undefined) return data;
      if (!promise) {
        promise = fetcher().then(
          (r) => (data = {data: r}),
          (e) => (data = {error: e})
        );
      }
      throw promise;
    });
  }

  return cache.get(cacheKey).call() as RequestCacheResult<T>;
}
