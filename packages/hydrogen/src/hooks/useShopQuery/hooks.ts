import {useShop} from '../../foundation/useShop/index.js';
import {getLoggerWithContext} from '../../utilities/log/index.js';
import type {CachingStrategy, PreloadOptions} from '../../types.js';
import {graphqlRequestBody} from '../../utilities/index.js';
import {useServerRequest} from '../../foundation/ServerRequestProvider/index.js';
import {injectGraphQLTracker} from '../../utilities/graphql-tracker.js';
import {sendMessageToClient} from '../../utilities/devtools.js';
import {fetchSync} from '../../foundation/fetchSync/server/fetchSync.js';
import {META_ENV_SSR} from '../../foundation/ssr-interop.js';
import {getStorefrontApiRequestHeaders} from '../../utilities/storefrontApi.js';
import {parseJSON} from '../../utilities/parse.js';
import {STOREFRONT_API_BUYER_IP_HEADER} from '../../constants.js';

export interface UseShopQueryResponse<T> {
  /** The data returned by the query. */
  data: T;
  errors: any;
}

// Check if the response body has GraphQL errors
// https://spec.graphql.org/June2018/#sec-Response-Format
const shouldCacheResponse = ([body]: [any, Response]) => {
  try {
    return !parseJSON(body)?.errors;
  } catch {
    // If we can't parse the response, then assume
    // an error and don't cache the response
    return false;
  }
};

/**
 * The `useShopQuery` hook allows you to make server-only GraphQL queries to the Storefront API. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShopQuery<T>({
  query,
  variables = {},
  cache,
  preload = false,
}: {
  /** A string of the GraphQL query.
   * If no query is provided, useShopQuery will make no calls to the Storefront API.
   */
  query?: string;
  /** An object of the variables for the GraphQL query. */
  variables?: Record<string, any>;
  /** The [caching strategy](https://shopify.dev/custom-storefronts/hydrogen/framework/cache#caching-strategies) to
   * help you determine which cache control header to set.
   */
  cache?: CachingStrategy;
  /** A string corresponding to a valid locale identifier like `en-us` used to make the request. */
  locale?: string;
  /** Whether to[preload the query](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries).
   * Defaults to `false`. Specify `true` to preload the query for the URL or `'*'`
   * to preload the query for all requests.
   */
  preload?: PreloadOptions;
}): UseShopQueryResponse<T> {
  /**
   * If no query is passed, we no-op here to allow developers to obey the Rules of Hooks.
   */
  if (!query) {
    return {data: undefined as unknown as T, errors: undefined};
  }

  if (!META_ENV_SSR) {
    throw new Error(
      'Shopify Storefront API requests should only be made from the server.'
    );
  }

  const serverRequest = useServerRequest(); // eslint-disable-line react-hooks/rules-of-hooks
  const log = getLoggerWithContext(serverRequest);

  const body = query ? graphqlRequestBody(query, variables) : '';
  const {url, requestInit} = useCreateShopRequest(body); // eslint-disable-line react-hooks/rules-of-hooks

  let text: string;
  let data: any;
  let useQueryError: any;
  let response: ReturnType<typeof fetchSync> | null = null;

  try {
    response = fetchSync(url, {
      ...requestInit,
      cache,
      preload,
      shouldCacheResponse,
    });

    text = response.text();

    try {
      data = response.json();
    } catch (error: any) {
      if (response.headers.get('content-length')) {
        useQueryError = new Error(
          `Unable to parse response (x-request-id: ${response.headers.get(
            'x-request-id'
          )}):\n${text}`
        );
      } else {
        useQueryError = new Error(
          `${response.status} ${
            response.statusText
          } (x-request-id: ${response.headers.get('x-request-id')})`
        );
      }
    }
  } catch (error: any) {
    // Pass-through thrown promise for Suspense functionality
    if (error?.then) {
      throw error;
    }

    useQueryError = error;
  }

  /**
   * The fetch request itself failed, so we handle that differently than a GraphQL error
   */
  if (useQueryError) {
    const errorMessage = createErrorMessage(useQueryError);

    log.error(errorMessage);
    log.error(useQueryError);

    if (__HYDROGEN_DEV__ && !__HYDROGEN_TEST__) {
      throw new Error(errorMessage);
    } else {
      // in non-dev environments, we probably don't want super-detailed error messages for the user
      throw new Error(
        `The fetch attempt failed; there was an issue connecting to the data source.`
      );
    }
  }

  /**
   * GraphQL errors get printed to the console but ultimately
   * get returned to the consumer.
   */
  if (data?.errors) {
    const errors = Array.isArray(data.errors) ? data.errors : [data.errors];
    const requestId = response?.headers?.get('x-request-id') ?? '';
    for (const error of errors) {
      if (__HYDROGEN_DEV__ && !__HYDROGEN_TEST__) {
        throw new Error(
          `Storefront API GraphQL Error: ${error.message}.\nRequest id: ${requestId}`
        );
      } else {
        log.error(
          'Storefront API GraphQL Error',
          error,
          'Storefront API GraphQL request id',
          requestId
        );
      }
    }
    log.error(`Storefront API GraphQL error count: ${errors.length}`);
  }

  if (
    __HYDROGEN_DEV__ &&
    (log.options().showUnusedQueryProperties ||
      serverRequest.ctx.hydrogenConfig?.__EXPERIMENTAL__devTools) &&
    query &&
    data?.data
  ) {
    const fileLine = new Error('').stack
      ?.split('\n')
      .find((line) => line.includes('.server.'));
    const [, functionName, fileName] =
      fileLine?.match(/^\s*at (\w+) \(([^)]+)\)/) || [];

    injectGraphQLTracker({
      query,
      data,
      onUnusedData: ({queryName, properties}) => {
        const footer = `Examine the list of fields above to confirm that they are being used.\n`;
        const header = `Potentially overfetching fields in GraphQL query.\n`;
        let info = `Query \`${queryName}\``;
        if (fileName) {
          info += ` in file \`${fileName}\` (function \`${functionName}\`)`;
        }

        const n = 6;
        const shouldTrim = properties.length > n + 1;
        const shownProperties = shouldTrim
          ? properties.slice(0, n)
          : properties;
        const hiddenInfo = shouldTrim
          ? `  ...and ${properties.length - shownProperties.length} more\n`
          : '';

        const warning =
          header +
          info +
          `:\n• ${shownProperties.join(`\n• `)}\n` +
          hiddenInfo +
          footer;

        if (log.options().showUnusedQueryProperties) {
          log.warn(warning);
          sendMessageToClient('browser-console', {type: 'warn', data: warning});
        }
        if (serverRequest.ctx.hydrogenConfig?.__EXPERIMENTAL__devTools) {
          sendMessageToClient('dev-tools', {type: 'warn', data: warning});
        }
      },
    });
  }

  return data!;
}

function useCreateShopRequest(body: string) {
  const {
    storeDomain,
    storefrontToken,
    storefrontApiVersion,
    storefrontId,
    privateStorefrontToken,
  } = useShop();

  const request = useServerRequest();
  const buyerIp = request.getBuyerIp();

  let headers: Record<string, string> = {
    'X-SDK-Variant': 'hydrogen',
    'X-SDK-Version': storefrontApiVersion,
    'content-type': 'application/json',
  };

  if (request.ctx.requestGroupID) {
    headers['Custom-Storefront-Request-Group-ID'] = request.ctx.requestGroupID;
  }

  const extraHeaders = getStorefrontApiRequestHeaders({
    buyerIp,
    publicStorefrontToken: storefrontToken,
    privateStorefrontToken,
    storefrontId,
  });

  console.log(
    `Using ${extraHeaders[STOREFRONT_API_BUYER_IP_HEADER]} for buyer IP`
  );

  headers = {...headers, ...extraHeaders};

  return {
    key: [storeDomain, storefrontApiVersion, body],
    url: `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`,
    requestInit: {
      body,
      method: 'POST',
      headers,
    },
  };
}

function createErrorMessage(fetchError: Response | Error) {
  if (fetchError instanceof Response) {
    return `An error occurred while fetching from the Storefront API. ${
      // 403s to the SF API (almost?) always mean that your Shopify credentials are bad/wrong
      fetchError.status === 403
        ? `You may have a bad value in 'hydrogen.config.js'`
        : `${fetchError.statusText}`
    }`;
  } else {
    return `Failed to connect to the Storefront API: ${fetchError.message}`;
  }
}
