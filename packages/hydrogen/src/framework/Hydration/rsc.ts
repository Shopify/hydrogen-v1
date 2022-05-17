// TODO should we move this file to src/foundation
// so it is considered ESM instead of CJS?

// @ts-ignore
import {unstable_getCacheForType, unstable_useCacheRefresh} from 'react';
import {
  createFromFetch,
  createFromReadableStream,
  // @ts-ignore
} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import {RSC_PATHNAME} from '../../constants';

let rscReader: ReadableStream | null;

// Hydrate an SSR response from <meta> tags placed in the DOM.
const flightChunks: string[] = [];
const FLIGHT_ATTRIBUTE = 'data-flight';

function addElementToFlightChunks(el: Element) {
  const chunk = el.getAttribute(FLIGHT_ATTRIBUTE);
  if (chunk) {
    flightChunks.push(decodeURIComponent(chunk));
  }
}

// Get initial payload
document
  .querySelectorAll('[' + FLIGHT_ATTRIBUTE + ']')
  .forEach(addElementToFlightChunks);

// Create a mutation observer on the document to detect when new
// <meta data-flight> tags are added, and add them to the array.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (
        node instanceof HTMLElement &&
        node.tagName === 'META' &&
        node.hasAttribute(FLIGHT_ATTRIBUTE)
      ) {
        addElementToFlightChunks(node);
      }
    });
  });
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

if (flightChunks.length > 0) {
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

        flightChunks.forEach(write);
        flightChunks.push = write;

        contentLoaded.then(() => {
          controller.close();
          observer.disconnect();
        });
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
      fetch(`${RSC_PATHNAME}?state=` + encodeURIComponent(key))
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
