import type {CachingStrategy, PreloadOptions, QueryKey} from '../../types';
import {
  getLoggerWithContext,
  collectQueryCacheControlHeaders,
  collectQueryTimings,
} from '../../utilities/log';
import {
  deleteItemFromCache,
  generateSubRequestCacheControlHeader,
  getItemFromCache,
  isStale,
  setItemInCache,
} from '../../framework/cache';
import {runDelayedFunction} from '../../framework/runtime';
import {useRequestCacheData, useServerRequest} from '../ServerRequestProvider';

export interface HydrogenUseQueryOptions {
  cache?: CachingStrategy;
  preload?: PreloadOptions;
}

/**
 * The `useQuery` hook is a wrapper around Suspense calls and
 * global runtime's Cache if it exists.
 * It supports Suspense calls on the server and on the client.
 */
export function useQuery<T>(
  /** A string or array to uniquely identify the current query. */
  key: QueryKey,
  /** An asynchronous query function like `fetch` which returns data. */
  queryFn: () => Promise<T>,
  /** Options including `cache` to manage the cache behavior of the sub-request. */
  queryOptions?: HydrogenUseQueryOptions
) {
  const request = useServerRequest();
  const withCacheIdKey = ['__QUERY_CACHE_ID__', ...key];
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

  /**
   * Attempt to read the query from cache. If it doesn't exist or if it's stale, regenerate it.
   */
  async function cachedQueryFn() {
    // Call this hook before running any async stuff
    // to prevent losing the current React cycle.
    const request = useServerRequest();
    const log = getLoggerWithContext(request);

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
      if (isStale(response)) {
        log.debug(
          '[useQuery] cache stale; generating new response in background'
        );
        const lockKey = `lock-${key}`;

        runDelayedFunction(async () => {
          log.debug(`[stale regen] fetching cache lock`);
          const lockExists = await getItemFromCache(lockKey);
          if (lockExists) return;

          await setItemInCache(lockKey, true);
          try {
            const output = await generateNewOutput();
            await setItemInCache(key, output, resolvedQueryOptions?.cache);
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
    runDelayedFunction(
      async () =>
        await setItemInCache(key, newOutput, resolvedQueryOptions?.cache)
    );

    collectQueryCacheControlHeaders(
      request,
      key,
      generateSubRequestCacheControlHeader(resolvedQueryOptions?.cache)
    );

    return newOutput;
  }

  return cachedQueryFn;
}
