import {type HydrogenUseQueryOptions, useQuery} from '../../useQuery/index.js';
import {ResponseSync} from '../ResponseSync.js';

/**
 * The `fetchSync` hook makes API requests and is the recommended way to make simple fetch calls on the server and the client.
 * It's designed similar to the [Web API's `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch), only in a way
 * that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html).
 */
export function fetchSync(
  originalUrl: string,
  options?: Omit<RequestInit, 'cache'> & HydrogenUseQueryOptions
) {
  let requestUrl;

  try {
    requestUrl = new URL(originalUrl);
  } catch (error: any) {
    // The URL is not valid, and the user likely tried to call a relative path in the same app.
    if (error instanceof TypeError && originalUrl.startsWith('/')) {
      throw new TypeError(
        `fetchSync() was called with a relative URL (${originalUrl}). Please use an absolute URL instead.\n` +
          `- If you're trying to fetch a relative path in the same app, query the data source directly from the server instead.\n` +
          `- If you're calling fetchSync() within a client component, use a conditional state like useEffect() to ` +
          `prevent it from being called on the server during pre-render.`
      );
    }

    // The URL is not valid for some other reason.
    throw error;
  }

  const url = requestUrl.toString();

  const {cache, preload, shouldCacheResponse, ...requestInit} = options ?? {};

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {data, error} = useQuery(
    [url, requestInit],
    async () => {
      const response = await globalThis.fetch(url, requestInit);

      return ResponseSync.toSerializable(response);
    },
    {
      cache,
      preload,
      shouldCacheResponse,
    }
  );

  if (error) {
    throw error;
  }

  return new ResponseSync(data);
}
