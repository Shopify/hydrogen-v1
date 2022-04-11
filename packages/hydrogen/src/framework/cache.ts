import type {QueryKey, CachingStrategy} from '../types';
import {getCache} from './runtime';
import {
  CacheSeconds,
  generateCacheControlHeader,
} from '../framework/CachingStrategy';
import {logCacheApiStatus} from '../utilities/log';

function getCacheControlSetting(
  userCacheOptions?: CachingStrategy,
  options?: CachingStrategy
): CachingStrategy {
  if (userCacheOptions && options) {
    return {
      ...userCacheOptions,
      ...options,
    };
  } else {
    return userCacheOptions || CacheSeconds();
  }
}

export function generateSubRequestCacheControlHeader(
  userCacheOptions?: CachingStrategy
): string {
  return generateCacheControlHeader(getCacheControlSetting(userCacheOptions));
}

export function hashKey(key: QueryKey): string {
  const rawKey = key instanceof Array ? key : [key];

  /**
   * TODO: Smarter hash
   */
  return rawKey.map((k) => JSON.stringify(k)).join('');
}

/**
 * Cache API is weird. We just need a full URL, so we make one up.
 */
function getKeyUrl(key: string) {
  return `https://shopify.dev/?${key}`;
}

/**
 * Get an item from the cache. If a match is found, returns a tuple
 * containing the `JSON.parse` version of the response as well
 * as the response itself so it can be checked for staleness.
 */
export async function getItemFromCache(
  key: QueryKey
): Promise<undefined | [any, Response]> {
  const cache = getCache();
  if (!cache) {
    return;
  }

  const url = getKeyUrl(hashKey(key));
  const request = new Request(url);

  const response = await cache.match(request);
  if (!response) {
    logCacheApiStatus('MISS', url);
    return;
  }

  logCacheApiStatus('HIT', url);

  return [await response.json(), response];
}

/**
 * Put an item into the cache.
 */
export async function setItemInCache(
  key: QueryKey,
  value: any,
  userCacheOptions?: CachingStrategy
) {
  const cache = getCache();
  if (!cache) {
    return;
  }

  const url = getKeyUrl(hashKey(key));
  const request = new Request(url);

  /**
   * We are manually managing staled request by adding this workaround.
   * Why? cache control header support is dependent on hosting platform
   *
   * For example:
   *
   * Cloudflare's Cache API does not support `stale-while-revalidate`.
   * Cloudflare cache control header has a very odd behaviour.
   * Say we have the following cache control header on a request:
   *
   *   public, max-age=15, stale-while-revalidate=30
   *
   * When there is a cache.match HIT, the cache control header would become
   *
   *   public, max-age=14400, stale-while-revalidate=30
   *
   * == `stale-while-revalidate` workaround ==
   * Update response max-age so that:
   *
   *   max-age = max-age + stale-while-revalidate
   *
   * For example:
   *
   *   public, max-age=1, stale-while-revalidate=9
   *                    |
   *                    V
   *   public, max-age=10, stale-while-revalidate=9
   *
   * Store the following information in the response header:
   *
   *   cache-put-date   - UTC time string of when this request is PUT into cache
   *
   * Note on `cache-put-date`: The `response.headers.get('date')` isn't static. I am
   * not positive what date this is returning but it is never over 500 ms
   * after subtracting from the current timestamp.
   *
   * `isStale` function will use the above information to test for stale-ness of a cached response
   */
  const cacheControl = getCacheControlSetting(userCacheOptions);
  const headers = new Headers({
    'cache-control': generateSubRequestCacheControlHeader(
      getCacheControlSetting(cacheControl, {
        maxAge:
          (cacheControl.maxAge || 0) + (cacheControl.staleWhileRevalidate || 0),
      })
    ),
    'cache-put-date': new Date().toUTCString(),
  });

  const response = new Response(JSON.stringify(value), {headers});

  logCacheApiStatus('PUT', url);
  await cache.put(request, response);
}

export async function deleteItemFromCache(key: QueryKey) {
  const cache = getCache();
  if (!cache) return;

  const url = getKeyUrl(hashKey(key));
  const request = new Request(url);

  logCacheApiStatus('DELETE', url);
  await cache.delete(request);
}

/**
 * Manually check the response to see if it's stale.
 */
export function isStale(
  response: Response,
  userCacheOptions?: CachingStrategy
) {
  const responseMaxAge = getCacheControlSetting(userCacheOptions).maxAge || 0;
  const responseDate = response.headers.get('cache-put-date');

  if (!responseDate) return false;

  const ageInMs =
    new Date().valueOf() - new Date(responseDate as string).valueOf();
  const age = ageInMs / 1000;

  return age > responseMaxAge;
}
