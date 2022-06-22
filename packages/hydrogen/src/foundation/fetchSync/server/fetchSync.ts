import {parseJSON} from '../../../utilities/parse';
import {type HydrogenUseQueryOptions, useQuery} from '../../useQuery/hooks';
import {useUrl} from '../../useUrl';
import type {FetchResponse} from '../types';

/**
 * The `fetchSync` hook makes API requests and is the recommended way to make simple fetch calls on the server and the client.
 * It's designed similar to the [Web API's `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch), only in a way
 * that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html).
 */
export function fetchSync(
  url: string,
  options?: Omit<RequestInit, 'cache'> & HydrogenUseQueryOptions
): FetchResponse {
  const {cache, preload, shouldCacheResponse, ...requestInit} = options ?? {};
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {origin} = useUrl();

  const {data: useQueryResponse, error} = useQuery<[string, Response]>( // eslint-disable-line react-hooks/rules-of-hooks
    [url, requestInit],
    async () => {
      const response = await globalThis.fetch(
        new URL(url, origin),
        requestInit
      );

      const text = await response.text();
      return [text, response];
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

  const [data, response] = useQueryResponse;

  return {
    response,
    json: () => parseJSON(data),
    text: () => data,
  };
}
