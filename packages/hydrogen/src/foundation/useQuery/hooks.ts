import type {CacheOptions, QueryKey} from '../../types';
import {log} from '../../utilities/log';
import {
  deleteItemFromCache,
  getItemFromCache,
  isStale,
  setItemInCache,
} from '../../framework/cache';
import {runDelayedFunction} from '../../framework/runtime';
import {useRenderCacheData} from '../RenderCacheProvider/hook';

import type {RenderCacheResult} from '../RenderCacheProvider/types';
export interface HydrogenUseQueryOptions {
  cache: CacheOptions;
}

/**
 * The `useQuery` hook is a wrapper around Suspense calls and
 * global runtime's Cache if it exist.
 * It supports Suspense calls on the server and on the client.
 */
export function useQuery<T>(
  /** A string or array to uniquely identify the current query. */
  key: QueryKey,
  /** An asynchronous query function like `fetch` which returns data. */
  queryFn: () => Promise<T>,
  /** Options including `cache` to manage the cache behavior of the sub-request. */
  queryOptions?: HydrogenUseQueryOptions
): RenderCacheResult<T> {
  return useRenderCacheData<T>(
    key,
    cachedQueryFnBuilder(key, queryFn, queryOptions)
  );
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
    const cacheResponse = await getItemFromCache(key);

    async function generateNewOutput() {
      return await queryFn();
    }

    if (cacheResponse) {
      const [output, response] = cacheResponse;

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

    return newOutput;
  }

  return cachedQueryFn;
}
