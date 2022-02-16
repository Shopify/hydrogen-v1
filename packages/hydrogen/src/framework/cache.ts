import type {QueryKey, CachingStrategy} from '../types';
import {getCache} from './runtime';
import {
  CacheSeconds,
  generateCacheControlHeader,
} from '../framework/CachingStrategy';

export function generateSubRequestCacheControlHeader(
  userCacheOptions?: CachingStrategy
): string {
  return generateCacheControlHeader(userCacheOptions || CacheSeconds());
}

/**
 * Use a preview header during development.
 * TODO: Support an override of this to force the cache
 * header to be present during dev. ENV var maybe?
 */
export function getCacheControlHeader({dev}: {dev?: boolean}) {
  return dev ? 'cache-control-preview' : 'cache-control';
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
  if (!response) return;

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
  const headers = new Headers({
    'cache-control': generateSubRequestCacheControlHeader(userCacheOptions),
  });

  const response = new Response(JSON.stringify(value), {headers});

  /**
   * WARNING: Cloudflare's Cache API does not support `stale-while-revalidate`
   * so this implementation will not work as expected on that platform.
   */
  await cache.put(request, response);
}

export async function deleteItemFromCache(key: QueryKey) {
  const cache = getCache();
  if (!cache) return;

  const url = getKeyUrl(hashKey(key));
  const request = new Request(url);

  await cache.delete(request);
}

/**
 * Manually check the response to see if it's stale.
 */
export function isStale(response: Response) {
  const responseDate = response.headers.get('date');
  const responseCacheControl = response.headers.get('cache-control');

  if (!responseDate || !responseCacheControl) return false;

  const responseMaxAgeMatch = responseCacheControl.match(/max-age=(\d+)/);

  if (!responseMaxAgeMatch) return false;
  const responseMaxAge = parseInt(responseMaxAgeMatch[1]);

  const ageInMs =
    new Date().valueOf() - new Date(responseDate as string).valueOf();
  const age = ageInMs / 1000;

  return age > responseMaxAge;
}
