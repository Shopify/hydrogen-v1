// @ts-ignore
import {unstable_getCacheForType, unstable_useCacheRefresh} from 'react';
import {
  createFromFetch,
  createFromReadableStream,
} from '../Hydration/rsc-client-hydrator';
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

  // @ts-ignore
  if (window.__flight) {
    // The flight response was inlined during SSR, use it directly.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // @ts-ignore
        controller.enqueue(encoder.encode(window.__flight));
        controller.close();
      },
    });

    response = createFromReadableStream(stream);

    // @ts-ignore
    delete window.__flight;
  } else {
    // Request a new flight response.
    response = createFromFetch(
      fetch('/react?state=' + encodeURIComponent(key))
    );
  }

  cache.set(key, response);
  return response;
}

export function useRefresh() {
  const refreshCache = unstable_useCacheRefresh();
  return function refresh(key: string, seededResponse: any) {
    refreshCache(createResponseCache, new Map([[key, seededResponse]]));
  };
}
