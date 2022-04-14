import type {CachingStrategy, PreloadOptions, QueryKey} from '../../types';
import {
  getLoggerWithContext,
  collectQueryCacheControlHeaders,
  collectQueryTimings,
  logCacheApiStatus,
} from '../../utilities/log';
import {
  deleteItemFromCache,
  generateSubRequestCacheControlHeader,
  getItemFromCache,
  isStale,
  setItemInCache,
} from '../../framework/cache';
import {hashKey} from '../../utilities/hash';
import {runDelayedFunction} from '../../framework/runtime';
import {useRequestCacheData, useServerRequest} from '../ServerRequestProvider';

export interface HydrogenUseQueryOptions {
  /** The [caching strategy](/custom-storefronts/hydrogen/framework/cache#caching-strategies) to help you
   * determine which cache control header to set.
   */
  cache?: CachingStrategy;
  /** Whether to [preload the query](/custom-storefronts/hydrogen/framework/preloaded-queries).
   * Defaults to `false`. Specify `true` to preload the query for the URL or `'*'`
   * to preload the query for all requests.
   */
  preload?: PreloadOptions;
  /** A function that inspects the response body to determine if it should be cached.
   */
  shouldCacheResponse?: (body: any) => boolean;
}

/**
 * The `useQuery` hook executes an asynchronous operation like `fetch` in a way that
 * supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html). You can use this
 * hook to call any third-party APIs from a server component.
 *
 * \> Note:
 * \> If you're making a simple fetch call on the server, then we recommend using the [`fetchSync`](/api/hydrogen/hooks/global/fetchsync) hook instead.
 */
export function useQuery<T>(
  /** A string or array to uniquely identify the current query. */
  key: QueryKey,
  /** An asynchronous query function like `fetch` which returns data. */
  queryFn: () => Promise<T>,
  /** The options to manage the cache behavior of the sub-request. */
  queryOptions?: HydrogenUseQueryOptions
) {
  const request = useServerRequest();
  const withCacheIdKey = [
    '__QUERY_CACHE_ID__',
    ...(typeof key === 'string' ? [key] : key),
  ];
  const fetcher = cachedQueryFnBuilder<T>(
    withCacheIdKey,
    queryFn,
    queryOptions
  );

  collectQueryTimings(request, withCacheIdKey, 'requested');

  if (queryOptions?.preload) {
    request.savePreloadQuery({
      preload: queryOptions?.preload,
      key: withCacheIdKey,
      fetcher,
    });
  }

  return useRequestCacheData<T>(withCacheIdKey, fetcher);
}

function cachedQueryFnBuilder<T>(
  key: QueryKey,
  queryFn: () => Promise<T>,
  queryOptions?: HydrogenUseQueryOptions
) {
  const resolvedQueryOptions = {
    ...(queryOptions ?? {}),
  };

  const shouldCacheResponse = queryOptions?.shouldCacheResponse ?? (() => true);

  /**
   * Attempt to read the query from cache. If it doesn't exist or if it's stale, regenerate it.
   */
  async function cachedQueryFn() {
    // Call this hook before running any async stuff
    // to prevent losing the current React cycle.
    const request = useServerRequest();
    const log = getLoggerWithContext(request);
    const hashedKey = hashKey(key);

    const cacheResponse = await getItemFromCache(key);

    async function generateNewOutput() {
      return await queryFn();
    }

    if (cacheResponse) {
      const [output, response] = cacheResponse;

      collectQueryCacheControlHeaders(
        request,
        key,
        response.headers.get('cache-control')
      );

      /**
       * Important: Do this async
       */
      if (isStale(response, resolvedQueryOptions?.cache)) {
        logCacheApiStatus('STALE', hashedKey);
        const lockKey = `lock-${key}`;

        runDelayedFunction(async () => {
          logCacheApiStatus('UPDATING', hashedKey);
          const lockExists = await getItemFromCache(lockKey);
          if (lockExists) return;

          await setItemInCache(lockKey, true);
          try {
            const output = await generateNewOutput();

            if (shouldCacheResponse(output)) {
              await setItemInCache(key, output, resolvedQueryOptions?.cache);
            }
          } catch (e: any) {
            log.error(`Error generating async response: ${e.message}`);
          } finally {
            await deleteItemFromCache(lockKey);
          }
        });
      }

      return output;
    }

    const newOutput = await generateNewOutput();

    /**
     * Important: Do this async
     */
    if (shouldCacheResponse(newOutput)) {
      runDelayedFunction(() =>
        setItemInCache(key, newOutput, resolvedQueryOptions?.cache)
      );
    }

    collectQueryCacheControlHeaders(
      request,
      key,
      generateSubRequestCacheControlHeader(resolvedQueryOptions?.cache)
    );

    return newOutput;
  }

  return cachedQueryFn;
}
