import {print} from 'graphql';
import {LIB_VERSION} from '../version';
import {ASTNode} from 'graphql';

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
  query: ASTNode | string,
  variables?: Record<string, any>
) {
  const queryString = typeof query === 'string' ? query : print(query);
  return JSON.stringify({
    query: queryString,
    variables,
  });
}

export function decodeShopifyId(id: string) {
  if (!id.startsWith('gid://')) {
    throw new Error('invalid Shopify ID');
  }
  return id;
}
