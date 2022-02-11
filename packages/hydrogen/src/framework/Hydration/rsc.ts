// TODO should we move this file to src/foundation
// so it is considered ESM instead of CJS?

// @ts-ignore
import {unstable_getCacheForType, unstable_useCacheRefresh} from 'react';
import {
  createFromFetch,
  createFromReadableStream,
  // @ts-ignore
} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import {REACT_HYDRATION_REQUEST} from '../../constants';

declare global {
  // eslint-disable-next-line no-var
  var __flight: Array<string>;
}

let rscReader: ReadableStream | null;

if (__flight && __flight.length > 0) {
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

        __flight.forEach(write);
        __flight.push = write;

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
    if (
      /* @ts-ignore */
      window.BOOMR &&
      /* @ts-ignore */
      window.BOOMR.plugins &&
      /* @ts-ignore */
      window.BOOMR.plugins.Hydrogen
    ) {
      /* @ts-ignore */
      window.BOOMR.plugins.Hydrogen.trackSubPageLoadPerformance();
    }

    // Request a new flight response.
    response = createFromFetch(
      fetch(`${REACT_HYDRATION_REQUEST}?state=` + encodeURIComponent(key))
    );
  }

  cache.clear();
  cache.set(key, response);
  return response;
}

export function useRefresh() {
  const refreshCache = unstable_useCacheRefresh();
  refreshCache();
}
