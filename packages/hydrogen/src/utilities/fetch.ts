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
      if (response.status === 403 || response.status === 401) {
        throw new Error(
          `Request to the Storefront API failed! You may have a bad value in 'hydrogen.config.js'. Response status: ${
            response.status
          }, Request ID: ${response.headers.get('x-request-id')}`
        );
      }
      throw new Error(
        `Request to the Storefront API failed! Response status: ${
          response.status
        }, Request ID: ${response.headers.get('x-request-id')}`
      );
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
