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

  let body: string;

  return async () => {
    // Since a request's body can't be consumed more than once,
    // and throws at the attempt afterwards,
    // and this function can be cached and re-used, we cache
    // the body in the outer scope.
    if (!body) {
      body = await request.text();
    }

    // Oxygen's fetch is a Go implementation which
    // currently doesn't process some the call
    // signatures well. Specifically, it can't
    // consume request/response "body" property
    // if it follows the standard and is a ReadableStream
    // instance. It worked before because old Fetch API polyfills
    // in Oxygen didn't follow the standard but soon they will,
    // and we have to adjust the way we call fetch().

    // Oxygen aims at being eventually compliant
    // with the Fetch API, making these quirks redundant.

    // Headers must be a plain object unless the whole second argument is instanceof Request
    // @ts-ignore
    const headers = Object.fromEntries(request.headers.entries());

    const response = await fetch(request.url, {
      body,
      headers,
      method: request.method,
    });

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
