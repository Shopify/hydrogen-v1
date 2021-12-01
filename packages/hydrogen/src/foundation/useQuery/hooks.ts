import type {CacheOptions, QueryKey} from '../../types';
import {
  deleteItemFromCache,
  getItemFromCache,
  isStale,
  setItemInCache,
  hashKey,
} from '../../framework/cache';
import {runDelayedFunction} from '../../framework/runtime';
import {SuspensePromise} from './SuspensePromise';
import {useRequest} from '../RequestServerProvider/hook';

export interface HydrogenUseQueryOptions {
  cache: CacheOptions;
}
type SuspenseCache = Map<string, SuspensePromise<unknown>>;

let requestCaches: Map<string, SuspenseCache> = new Map();

function getRequestCache(): SuspenseCache {
  const {requestId} = useRequest();

  let requestCache: SuspenseCache | undefined = requestCaches.get(requestId);
  if (!requestCache) {
    requestCache = new Map();
    requestCaches.set(requestId, requestCache);
  }
  return requestCache;
}

export function clearRequestCache(requestId: string) {
  requestCaches.delete(requestId);
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
  const suspensePromise = getSuspensePromise<T>(key, queryFn, queryOptions);
  const status = suspensePromise.status;

  if (status === SuspensePromise.PENDING) {
    throw suspensePromise.promise;
  } else if (status === SuspensePromise.ERROR) {
    throw suspensePromise.result;
  } else if (status === SuspensePromise.SUCCESS) {
    return suspensePromise.result as T;
  }

  throw 'useQuery - something is really wrong if this throws';
}

function getSuspensePromise<T>(
  key: QueryKey,
  queryFn: () => Promise<T>,
  queryOptions?: HydrogenUseQueryOptions
): SuspensePromise<T> {
  const cacheKey = hashKey(key);
  const suspenseCache = getRequestCache();
  let suspensePromise = suspenseCache.get(cacheKey);
  if (!suspensePromise) {
    suspensePromise = new SuspensePromise<T>(
      cachedQueryFnBuilder(key, queryFn, queryOptions),
      queryOptions?.cache?.maxAge
    );
    suspenseCache.set(cacheKey, suspensePromise);
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
