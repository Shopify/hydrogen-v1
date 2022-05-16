// TODO should we move this file to src/foundation
// so it is considered ESM instead of CJS?

import {
  createFromFetch,
  createFromReadableStream,
  // @ts-ignore
} from '@shopify/hydrogen/vendor/react-server-dom-vite';
import {RSC_PATHNAME} from '../../constants';

let rscReader: ReadableStream | null;

const cache = new Map();

/**
 * Much of this is borrowed from React's demo implementation:
 * @see https://github.com/reactjs/server-components-demo/blob/main/src/Cache.client.js
 *
 * Note that we'd want to add some other constraints and controls around caching here.
 */
export function useServerResponse(state: any) {
  const key = JSON.stringify(state);

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
