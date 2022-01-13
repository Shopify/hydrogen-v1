// @ts-ignore
import {unstable_getCacheForType, unstable_useCacheRefresh} from 'react';
import {
  createFromFetch,
  createFromReadableStream,
  // @ts-ignore
} from '@shopify/hydrogen/vendor/react-server-dom-vite';

declare global {
  // eslint-disable-next-line no-var
  var __flight: Array<string>;
}

let rscReader: ReadableStream | null;

if (window.__flight && window.__flight.length > 0) {
  const contentLoaded = new Promise((resolve) =>
    document.addEventListener('DOMContentLoaded', resolve)
  );

  try {
    rscReader = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const write = (chunk: string) => {
          controller.enqueue(encoder.encode(chunk));
          return 0;
        };

        window.__flight.forEach(write);
        window.__flight.push = write;

        contentLoaded.then(() => controller.close());
      },
    });
  } catch (_) {
    // Old browser, will try a new hydration request later
  }
}

function createResponseCache() {
  return new Map<string, any>();
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

  if (rscReader) {
    // The flight response was inlined during SSR, use it directly.
    response = createFromReadableStream(rscReader);
    rscReader = null;
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
