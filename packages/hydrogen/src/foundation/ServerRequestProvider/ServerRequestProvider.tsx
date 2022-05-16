import React from 'react';
import {getTime} from '../../utilities/timing';
import {hashKey} from '../../utilities/hash';
import type {
  PreloadQueriesByURL,
  ServerComponentRequest,
} from '../../framework/Hydration/ServerComponentRequest.server';
import type {QueryKey} from '../../types';
import {collectQueryTimings} from '../../utilities/log';

// Cache to inject current request in RSC
function getRequestCache() {
  const dispatcher =
    // @ts-ignore
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
      .ReactCurrentDispatcher.current;

  if (!dispatcher.HydrogenServerCache) {
    dispatcher.HydrogenServerCache = new Map();
  }

  // @ts-ignore
  return dispatcher.HydrogenServerCache;
}

const requestKey = Symbol.for('HYDROGEN_REQUEST');

type ServerRequestProviderProps = {
  request: ServerComponentRequest;
  children: JSX.Element;
};

export function ServerRequestProvider({
  request,
  children,
}: ServerRequestProviderProps) {
  const requestCache = getRequestCache();

  requestCache.set(requestKey, request);

  return children;
}

export function useServerRequest() {
  const cache = getRequestCache();
  const request = cache ? cache.get(requestKey) : null;

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
