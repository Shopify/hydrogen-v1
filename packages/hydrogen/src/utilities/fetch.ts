import {LIB_VERSION} from '../version.js';

const defaultHeaders = {
  'content-type': 'application/json',
  'user-agent': `Hydrogen ${LIB_VERSION}`,
};

type FetchInit = {
  body?: string;
  method?: string;
  headers?: Record<string, string>;
};

export function fetchBuilder<T>(url: string, options: FetchInit = {}) {
  const requestInit = {
    ...options,
    headers: {...defaultHeaders, ...options.headers},
  };

  return async () => {
    const response = await fetch(url, requestInit);

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();

    return data as T;
  };
}

export function graphqlRequestBody(
  query: string,
  variables?: Record<string, any>
) {
  return JSON.stringify({
    query,
    variables,
  });
}

export function decodeShopifyId(id: string) {
  if (!id.startsWith('gid://')) {
    throw new Error('invalid Shopify ID');
  }
  return id;
}
