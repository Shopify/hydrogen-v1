import {type HydrogenUseQueryOptions, useQuery} from './useQuery/hooks';

interface FetchResponse {
  response: Response;
  json: () => any;
  text: () => any;
}

export function fetch(
  url: string,
  options?: Omit<RequestInit, 'cache'> & HydrogenUseQueryOptions
): FetchResponse {
  const {cache, preload, shouldCacheResponse, ...requestInit} = options ?? {};

  const {data: useQueryResponse, error} = useQuery<[string, Response]>(
    [url, options],
    async () => {
      const response = await globalThis.fetch(url, requestInit);

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
    json: () => JSON.parse(data),
    text: () => data,
  };
}
