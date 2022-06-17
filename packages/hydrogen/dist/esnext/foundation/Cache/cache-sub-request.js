import { getCache } from '../runtime';
import { hashKey } from '../../utilities/hash';
import * as CacheApi from './cache';
import { CacheShort } from './strategies';
/**
 * Wrapper Cache functions for sub queries
 */
/**
 * Cache API is weird. We just need a full URL, so we make one up.
 */
function getKeyUrl(key) {
    return `https://shopify.dev/?${key}`;
}
function getCacheOption(userCacheOptions) {
    return userCacheOptions || CacheShort();
}
export function generateSubRequestCacheControlHeader(userCacheOptions) {
    return CacheApi.generateDefaultCacheControlHeader(getCacheOption(userCacheOptions));
}
/**
 * Get an item from the cache. If a match is found, returns a tuple
 * containing the `JSON.parse` version of the response as well
 * as the response itself so it can be checked for staleness.
 */
export async function getItemFromCache(key) {
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
export async function setItemInCache(key, value, userCacheOptions) {
    const cache = getCache();
    if (!cache) {
        return;
    }
    const url = getKeyUrl(hashKey(key));
    const request = new Request(url);
    const response = new Response(JSON.stringify(value));
    await CacheApi.setItemInCache(request, response, getCacheOption(userCacheOptions));
}
export async function deleteItemFromCache(key) {
    const cache = getCache();
    if (!cache)
        return;
    const url = getKeyUrl(hashKey(key));
    const request = new Request(url);
    await CacheApi.deleteItemFromCache(request);
}
/**
 * Manually check the response to see if it's stale.
 */
export function isStale(key, response) {
    return CacheApi.isStale(new Request(getKeyUrl(hashKey(key))), response);
}
