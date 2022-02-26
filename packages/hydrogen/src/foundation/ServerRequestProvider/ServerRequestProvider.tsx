import React, {createContext, useContext} from 'react';
import {getTime} from '../../utilities/timing';

import {hashKey} from '../../framework/cache';
import type {
  PreloadQueriesByURL,
  ServerComponentRequest,
} from '../../framework/Hydration/ServerComponentRequest.server';
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
        collectQueryTimings(request, key, 'rendered');
        return data;
      }
      if (!promise) {
        const startApiTime = getTime();
        try {
          promise = fetcher().then(
            (r) => {
              data = {data: r};
              collectQueryTimings(
                request,
                key,
                'resolved',
                getTime() - startApiTime
              );
            },
            (e) => {
              console.log('useRequestCacheData: fetcher error', e);
              data = {error: e};
            }
          );
        } catch (e) {
          console.log('useRequestCacheData', e);
        }
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
  preloadQueries?: PreloadQueriesByURL
): void {
  const cache = request.ctx.cache;

  preloadQueries?.forEach((preloadQuery, cacheKey) => {
    collectQueryTimings(request, preloadQuery.key, 'preload');

    if (!cache.has(cacheKey)) {
      let data: unknown;
      let promise: Promise<unknown>;

      cache.set(cacheKey, () => {
        if (data !== undefined) {
          collectQueryTimings(request, preloadQuery.key, 'rendered');
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
                'resolved',
                getTime() - startApiTime
              );
            },
            (e) => {
              // The preload query failed for some reason, could be due to Cloudfare such as:
              //
              // Error: Cannot perform I/O on behalf of a different request. I/O objects (such as streams,
              // request/response bodies, and others) created in the context of one request handler cannot
              // be accessed from a different request's handler. This is a limitation of Cloudflare Workers
              // which allows us to improve overall performance.
              //
              // On Cloudfare, this happens when a Cache item has expired (max-age)
              //
              // We need to remove this entry from cache so that render cycle will retry on its own
              cache.delete(cacheKey);
              collectQueryTimings(
                request,
                preloadQuery.key,
                'expired',
                getTime() - startApiTime
              );
            }
          );
        }
        return promise;
      });
    }

    cache.get(cacheKey).call();
  });
}
