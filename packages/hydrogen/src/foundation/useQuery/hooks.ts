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
} from '../Cache/cache-sub-request';
import {useRequestCacheData, useServerRequest} from '../ServerRequestProvider';
import {CacheShort, NO_STORE} from '../Cache/strategies';
import type {HydrogenRequest} from '../HydrogenRequest/HydrogenRequest.server';

export interface HydrogenUseQueryOptions {
  /** The [caching strategy](https://shopify.dev/custom-storefronts/hydrogen/framework/cache#caching-strategies) to help you
   * determine which cache control header to set.
   */
  cache?: CachingStrategy;
  /** Whether to [preload the query](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries).
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
 * \> If you're making a simple fetch call on the server, then we recommend using the [`fetchSync`](https://shopify.dev/api/hydrogen/hooks/global/fetchsync) hook instead.
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

  if (shouldPreloadQuery(queryOptions)) {
    request.savePreloadQuery({
      preload: queryOptions?.preload,
      key: withCacheIdKey,
      fetcher,
    });
  }

  return useRequestCacheData<T>(withCacheIdKey, fetcher);
}

export function shouldPreloadQuery(
  queryOptions?: HydrogenUseQueryOptions
): boolean {
  if (!queryOptions) return true;

  const hasCacheOverride = typeof queryOptions?.cache?.mode !== 'undefined';
  const hasPreloadOverride = typeof queryOptions?.preload !== 'undefined';
  const cacheValue = queryOptions?.cache?.mode;
  const preloadValue = queryOptions?.preload;

  // If preload is explicitly defined, then it takes precedence
  if (hasPreloadOverride) {
    return !!preloadValue;
  }

  return hasCacheOverride ? cacheValue !== NO_STORE : true;
}

function cachedQueryFnBuilder<T>(
  key: QueryKey,
  generateNewOutput: () => Promise<T>,
  queryOptions?: HydrogenUseQueryOptions
) {
  const resolvedQueryOptions = {
    ...(queryOptions ?? {}),
  };

  const shouldCacheResponse = queryOptions?.shouldCacheResponse ?? (() => true);

  /**
   * Attempt to read the query from cache. If it doesn't exist or if it's stale, regenerate it.
   */
  async function useCachedQueryFn(request: HydrogenRequest) {
    const log = getLoggerWithContext(request);

    const cacheResponse = await getItemFromCache(key);

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
      if (isStale(key, response)) {
        const lockKey = ['lock', ...(typeof key === 'string' ? [key] : key)];

        // Run revalidation asynchronously
        const revalidatingPromise = getItemFromCache(lockKey).then(
          async (lockExists) => {
            if (lockExists) return;

            await setItemInCache(
              lockKey,
              true,
              CacheShort({
                maxAge: 10,
              })
            );

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
          }
        );

        // Asynchronously wait for it in workers
        request.ctx.runtime?.waitUntil?.(revalidatingPromise);
      }

      return output;
    }

    const newOutput = await generateNewOutput();

    /**
     * Important: Do this async
     */
    if (shouldCacheResponse(newOutput)) {
      const setItemInCachePromise = setItemInCache(
        key,
        newOutput,
        resolvedQueryOptions?.cache
      );

      request.ctx.runtime?.waitUntil?.(setItemInCachePromise);
    }

    collectQueryCacheControlHeaders(
      request,
      key,
      generateSubRequestCacheControlHeader(resolvedQueryOptions?.cache)
    );

    return newOutput;
  }

  return useCachedQueryFn;
}
