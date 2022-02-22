import React, {createContext, useContext} from 'react';
import {getTime} from '../../utilities/timing';

import {hashKey} from '../../framework/cache';
import type {
  PreloadQueries,
  ServerComponentRequest,
} from '../../framework/Hydration/ServerComponentRequest.server';
import type {QueryKey} from '../../types';
import {collectQueryTimings} from '../../utilities/log';

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
    // @ts-ignore
    if (__DEV__ && typeof jest !== 'undefined') {
      // Unit tests are not wrapped in ServerRequestProvider.
      // This mocks it, instead of providing it in every test.
      return {ctx: {}} as ServerComponentRequest;
    }

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
  const request = useServerRequest();
  const cache = request.ctx.cache;
  const cacheKey = hashKey(key);

  if (!cache.has(cacheKey)) {
    let data: RequestCacheResult<T>;
    let promise: Promise<RequestCacheResult<T> | void>;

    cache.set(cacheKey, () => {
      if (data !== undefined) {
        collectQueryTimings(request, key, 'render');
        return data;
      }
      if (!promise) {
        const startApiTime = getTime();
        promise = fetcher().then(
          (r) => {
            data = {data: r};
            collectQueryTimings(request, key, 'data', getTime() - startApiTime);
          },
          (e) => (data = {error: e})
        );
      }
      throw promise;
    });
  }

  // Making sure the promise has returned data because it can be initated by a preload request,
  // otherwise, we throw the promise
  const result = cache.get(cacheKey).call();
  if (result instanceof Promise) throw result;
  return result as RequestCacheResult<T>;
}

export function preloadRequestCacheData(
  request: ServerComponentRequest,
  preloadQueries?: PreloadQueries
): void {
  const cache = request.ctx.cache;

  preloadQueries?.forEach((preloadQuery, cacheKey) => {
    collectQueryTimings(request, preloadQuery.key, 'preload');

    if (!cache.has(cacheKey)) {
      let data: unknown;
      let promise: Promise<unknown>;

      cache.set(cacheKey, () => {
        if (data !== undefined) {
          collectQueryTimings(request, preloadQuery.key, 'render');
          return data;
        }
        if (!promise) {
          const startApiTime = getTime();
          promise = preloadQuery.fetcher().then(
            (r) => {
              data = {data: r};
              collectQueryTimings(
                request,
                preloadQuery.key,
                'data',
                getTime() - startApiTime
              );
            },
            (e) => (data = {error: e})
          );
        }
        return promise;
      });
    }

    cache.get(cacheKey).call();
  });
}
