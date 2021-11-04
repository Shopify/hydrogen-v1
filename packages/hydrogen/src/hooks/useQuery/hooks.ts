import {QueryFunctionContext, useQuery as useReactQuery} from 'react-query';
import type {UseQueryOptions, QueryKey, QueryFunction} from 'react-query';
import {CacheOptions} from '../../types';
import {
  deleteItemFromCache,
  getItemFromCache,
  isStale,
  setItemInCache,
} from '../../framework/cache';
import {runDelayedFunction} from '../../framework/runtime';

export interface HydrogenUseQueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
  cache: CacheOptions;
}

/**
 * The `useQuery` hook is a wrapper around `useQuery` from `react-query`. It supports Suspense calls on the server and on the client.
 */
export function useQuery<T>(
  /** A string or array to uniquely identify the current query. */
  key: QueryKey,
  /** An asynchronous query function like `fetch` which returns data. */
  queryFn: QueryFunction<T>,
  /** Options including `cache` to manage the cache behavior of the sub-request. */
  queryOptions?: HydrogenUseQueryOptions<T, Error, T, QueryKey>
) {
  /**
   * Attempt to read the query from cache. If it doesn't exist or if it's stale, regenerate it.
   */
  async function cachedQueryFn() {
    const cacheResponse = await getItemFromCache(key);

    async function generateNewOutput() {
      return await queryFn({} as QueryFunctionContext);
    }

    if (cacheResponse) {
      const [output, response] = cacheResponse;

      /**
       * Important: Do this async
       */
      if (isStale(response)) {
        console.log(
          '[useQuery] cache stale; generating new response in background'
        );
        const lockKey = `lock-${key}`;

        runDelayedFunction(async () => {
          console.log(`[stale regen] fetching cache lock`);
          const lockExists = await getItemFromCache(lockKey);
          if (lockExists) return;

          console.log(`[stale regen] no cache lock`);
          await setItemInCache(lockKey, true);
          console.log(`[stale regen] set cache lock`);
          try {
            const output = await generateNewOutput();
            console.log(`[stale regen] got new output`);
            await setItemInCache(key, output, queryOptions?.cache);
            console.log(`[stale regen] set new output`);
          } catch (e: any) {
            console.error(`Error generating async response: ${e.message}`);
          } finally {
            await deleteItemFromCache(lockKey);
            console.log(`[stale regen] deleted lock`);
          }
        });
      }

      console.log('[useQuery] returning cached response');

      return output;
    }

    console.log('[useQuery] cache miss; generating output');
    const newOutput = await generateNewOutput();

    /**
     * Important: Do this async
     */
    runDelayedFunction(
      async () => await setItemInCache(key, newOutput, queryOptions?.cache)
    );

    return newOutput;
  }

  return useReactQuery<T, Error>(key, cachedQueryFn, queryOptions);
}
