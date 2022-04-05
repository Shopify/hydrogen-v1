import {type HydrogenUseQueryOptions, useQuery} from './useQuery/hooks';

interface FetchResponse {
  json: () => any;
  text: () => any;
}

export function fetch(
  url: string,
  options?: Omit<RequestInit, 'cache'> & HydrogenUseQueryOptions
): FetchResponse {
  const {cache, preload, shouldCacheResponse, ...requestInit} = options ?? {};

  const {data, error} = useQuery<string>(
    [url, options],
    async () => {
      const response = await globalThis.fetch(url, requestInit);

      return await response.text();
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

  return {
    json: () => JSON.parse(data),
    text: () => data,
  };
}
