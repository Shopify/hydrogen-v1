import {print} from 'graphql';
import {LIB_VERSION} from '../version';
import {ASTNode} from 'graphql';

export function fetchBuilder<T>(request: Request) {
  const defaultHeaders: Record<string, string> = {
    'content-type': 'application/json',
    'user-agent': `Hydrogen ${LIB_VERSION}`,
  };

  for (const [property, value] of Object.entries(defaultHeaders)) {
    if (!request.headers.has(property)) {
      request.headers.append(property, value);
    }
  }

  return async () => {
    const response = await fetch(request.url, request);

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
  // Start fix: for SFAPI 2022-01. Remove when upgrading to 2022-04
  if (!id.startsWith('gid://')) {
    id =
      typeof btoa !== 'undefined'
        ? btoa(id)
        : Buffer.from(id, 'base64').toString('ascii');
  }
  // End fix

  if (!id.startsWith('gid://')) {
    throw new Error('invalid Shopify ID');
  }
  return id;
}
