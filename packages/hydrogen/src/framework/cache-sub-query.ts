import type {QueryKey, CachingStrategy} from '../types';
import {getCache} from './runtime';
import {hashKey} from '../utilities/hash';
import * as CacheApi from './cache';
import {CacheSeconds} from './CachingStrategy';

/**
 * Wrapper Cache functions for sub queries
 */

/**
 * Cache API is weird. We just need a full URL, so we make one up.
 */
function getKeyUrl(key: string) {
  return `https://shopify.dev/?${key}`;
}

export function generateSubRequestCacheControlHeader(
  userCacheOptions?: CachingStrategy
): string {
  return CacheApi.generateDefaultCacheControlHeader(
    userCacheOptions || CacheSeconds()
  );
}

/**
 * Get an item from the cache. If a match is found, returns a tuple
 * containing the `JSON.parse` version of the response as well
 * as the response itself so it can be checked for staleness.
 */
export async function getItemFromCache(
  key: QueryKey,
  userCacheOptions?: CachingStrategy
): Promise<undefined | [any, Response]> {
  const cache = getCache();

  if (!cache) {
    return;
  }

  const url = getKeyUrl(hashKey(key));
  const request = new Request(url);

  const response = await CacheApi.getItemFromCache(request);

  if (!response) {
    return;
  }

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
  const response = new Response(JSON.stringify(value));

  await CacheApi.setItemInCache(request, response, userCacheOptions);
}

export async function deleteItemFromCache(key: QueryKey) {
  const cache = getCache();
  if (!cache) return;

  const url = getKeyUrl(hashKey(key));
  const request = new Request(url);

  await CacheApi.deleteItemFromCache(request);
}

/**
 * Manually check the response to see if it's stale.
 */
export function isStale(response: Response) {
  return CacheApi.isStale(response);
}
