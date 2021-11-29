import type {CacheOptions, QueryKey} from '../../types';
import {
  deleteItemFromCache,
  getItemFromCache,
  isStale,
  setItemInCache,
  hashKey,
} from '../../framework/cache';
import {runDelayedFunction, getCache} from '../../framework/runtime';
import {SuspensePromise} from './SuspensePromise';

const suspensePromises: Map<string, SuspensePromise<unknown>> = new Map();

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
): T {
  const cacheKey = hashKey(key);
  const suspensePromise = getSuspensePromise<T>(key, queryFn, queryOptions);
  const status = suspensePromise.status;

  if (status === SuspensePromise.PENDING) {
    throw suspensePromise.promise;
  } else if (status === SuspensePromise.ERROR) {
    throw suspensePromise.result;
  } else if (status === SuspensePromise.SUCCESS) {
    // If we have Cache, we'll follow the cache maxAge spec before removing from SuspensePromise map
    if (getCache()) {
      setTimeout(() => {
        if (suspensePromises.has(cacheKey)) {
          suspensePromises.delete(cacheKey);
        }
      }, suspensePromise.maxAge);
    } else {
      suspensePromises.delete(cacheKey);
    }
    return suspensePromise.result as T;
  }

  throw 'useQuery - something is really wrong if this throws';
}

/**
 * The `preloadQuery` hook is a wrapper around Suspense calls that
 * doesn't block to help reduce Suspense waterfalls. It has the
 * same parameter signature as `useQuery`
 */
export function preloadQuery<T>(
  /** A string or array to uniquely identify the current query. */
  key: QueryKey,
  /** An asynchronous query function like `fetch` which returns data. */
  queryFn: () => Promise<T>,
  /** Options including `cache` to manage the cache behavior of the sub-request. */
  queryOptions?: HydrogenUseQueryOptions
): void {
  getSuspensePromise<T>(key, queryFn, queryOptions);
}

function getSuspensePromise<T>(
  key: QueryKey,
  queryFn: () => Promise<T>,
  queryOptions?: HydrogenUseQueryOptions
): SuspensePromise<T> {
  const cacheKey = hashKey(key);
  let suspensePromise = suspensePromises.get(cacheKey);
  if (!suspensePromise) {
    suspensePromise = new SuspensePromise<T>(
      cachedQueryFnBuilder(key, queryFn, queryOptions),
      queryOptions?.cache?.maxAge
    );
    suspensePromises.set(cacheKey, suspensePromise);
  }
  return suspensePromise as SuspensePromise<T>;
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
        console.log(
          '[useQuery] cache stale; generating new response in background'
        );
        const lockKey = `lock-${key}`;

        runDelayedFunction(async () => {
          console.log(`[stale regen] fetching cache lock`);
          const lockExists = await getItemFromCache(lockKey);
          if (lockExists) return;

          await setItemInCache(lockKey, true);
          try {
            const output = await generateNewOutput();
            await setItemInCache(key, output, resolvedQueryOptions?.cache);
          } catch (e: any) {
            console.error(`Error generating async response: ${e.message}`);
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
