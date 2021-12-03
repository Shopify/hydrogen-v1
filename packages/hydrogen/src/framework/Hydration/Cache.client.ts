// @ts-ignore
import {unstable_getCacheForType, unstable_useCacheRefresh} from 'react';
import {createFromFetch} from '../Hydration/rsc-client-hydrator';
import type {FlightResponse} from '../Hydration/rsc-client-config';

function createResponseCache() {
  return new Map<string, FlightResponse>();
}

/**
 * Much of this is borrowed from React's demo implementation:
 * @see https://github.com/reactjs/server-components-demo/blob/main/src/Cache.client.js
 *
 * Note that we'd want to add some other constraints and controls around caching here.
 */
export function useServerResponse(state: any) {
  const key = JSON.stringify(state);
  const cache: ReturnType<typeof createResponseCache> =
    unstable_getCacheForType(createResponseCache);

  let response = cache.get(key);
  if (response) {
    return response;
  }

  response = createFromFetch(fetch('/react?state=' + encodeURIComponent(key)));

  cache.set(key, response);
  return response;
}

export function useRefresh() {
  const refreshCache = unstable_useCacheRefresh();
  return function refresh(key: string, seededResponse: any) {
    refreshCache(createResponseCache, new Map([[key, seededResponse]]));
  };
}
