import React, {createContext, useContext} from 'react';
import {getTime} from '../../utilities/timing';
import {hashKey} from '../../utilities/hash';
import type {
  PreloadQueriesByURL,
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

// Note: use this only during RSC/Flight rendering. The React dispatcher
// for SSR/Fizz rendering does not implement getCacheForType.
function getCacheForType(resource: () => Map<any, any>) {
  const dispatcher =
    // @ts-ignore
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
      .ReactCurrentDispatcher.current;

  if (
    __HYDROGEN_DEV__ &&
    // @ts-ignore
    typeof jest !== 'undefined' &&
    !dispatcher.getCacheForType
  ) {
    // Jest does not have access to the RSC runtime, mock it here:
    // @ts-ignore
    return (globalThis.__jestRscCache ??= resource());
  }

  return dispatcher.getCacheForType(resource);
}

export function ServerRequestProvider({
  isRSC,
  request,
  children,
}: ServerRequestProviderProps) {
  if (isRSC) {
    // Save the request object in a React cache that is
    // scoped to this current rendering.

    const requestCache = getCacheForType(requestCacheRSC);

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
    // This cache only works during RSC rendering:
    // @ts-ignore
    const cache = getCacheForType(requestCacheRSC);
    request = cache ? cache.get(requestCacheRSC.key) : null;
  } catch {
    // If RSC cache failed it means this is not an RSC request.
    // Try getting SSR context instead:
    request = useContext(RequestContextSSR); // eslint-disable-line react-hooks/rules-of-hooks
  }

  if (!request) {
    // @ts-ignore
    if (__HYDROGEN_DEV__ && typeof jest !== 'undefined') {
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
  | {data?: never; error: Response | Error}; // failure

/**
 * Returns data stored in the request cache.
 * It will throw the promise if data is not ready.
 */
export function useRequestCacheData<T>(
  key: QueryKey,
  fetcher: () => T | Promise<T>
): RequestCacheResult<T> {
  const request = useServerRequest();
  const cache = request.ctx.cache;
  const cacheKey = hashKey(key);

  if (!cache.has(cacheKey)) {
    let result: RequestCacheResult<T>;
    let promise: Promise<RequestCacheResult<T> | void>;

    cache.set(cacheKey, () => {
      if (result !== undefined) {
        collectQueryTimings(request, key, 'rendered');
        return result;
      }

      if (!promise) {
        const startApiTime = getTime();
        const maybePromise = fetcher();

        if (!(maybePromise instanceof Promise)) {
          result = {data: maybePromise};
          return result;
        }

        promise = maybePromise.then(
          (data) => {
            result = {data};

            collectQueryTimings(
              request,
              key,
              'resolved',
              getTime() - startApiTime
            );
          },
          (error) => (result = {error})
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
  preloadQueries?: PreloadQueriesByURL
): void {
  const cache = request.ctx.cache;

  preloadQueries?.forEach((preloadQuery, cacheKey) => {
    collectQueryTimings(request, preloadQuery.key, 'preload');

    if (!cache.has(cacheKey)) {
      let result: unknown;
      let promise: Promise<unknown>;

      cache.set(cacheKey, () => {
        if (result !== undefined) {
          collectQueryTimings(request, preloadQuery.key, 'rendered');
          return result;
        }
        if (!promise) {
          const startApiTime = getTime();
          promise = preloadQuery.fetcher().then(
            (data) => {
              result = {data};
              collectQueryTimings(
                request,
                preloadQuery.key,
                'resolved',
                getTime() - startApiTime
              );
            },
            (error) => {
              result = {error};
            }
          );
        }
        return promise;
      });
    }

    cache.get(cacheKey).call();
  });
}
