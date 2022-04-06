import {useShop} from '../../foundation/useShop';
import {getLoggerWithContext} from '../../utilities/log';
import {ASTNode} from 'graphql';
import {useQuery} from '../../foundation/useQuery';
import type {CachingStrategy, PreloadOptions} from '../../types';
import {fetchBuilder, graphqlRequestBody} from '../../utilities';
import {getConfig} from '../../framework/config';
import {useServerRequest} from '../../foundation/ServerRequestProvider';
import {injectGraphQLTracker} from '../../utilities/graphql-tracker';
import {sendMessageToClient} from '../../utilities/devtools';
import {META_ENV_SSR} from '../../foundation/ssr-interop';

export interface UseShopQueryResponse<T> {
  /** The data returned by the query. */
  data: T;
  errors: any;
}

// Check if the response body has GraphQL errors
// https://spec.graphql.org/June2018/#sec-Response-Format
const shouldCacheResponse = (body: any) => !body?.errors;

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
  query?: ASTNode | string;
  /** An object of the variables for the GraphQL query. */
  variables?: Record<string, any>;
  /** The [caching strategy](/custom-storefronts/hydrogen/framework/cache#caching-strategies) to
   * help you determine which cache control header to set.
   */
  cache?: CachingStrategy;
  /** A string corresponding to a valid locale identifier like `en-us` used to make the request. */
  locale?: string;
  /** Whether to[preload the query](/custom-storefronts/hydrogen/framework/preloaded-queries).
   * Defaults to `false`. Specify `true` to preload the query for the URL or `'*'`
   * to preload the query for all requests.
   */
  preload?: PreloadOptions;
}): UseShopQueryResponse<T> {
  if (!META_ENV_SSR) {
    throw new Error(
      'Shopify Storefront API requests should only be made from the server.'
    );
  }

  const serverRequest = useServerRequest();
  const log = getLoggerWithContext(serverRequest);

  const body = query ? graphqlRequestBody(query, variables) : '';
  const {key, url, requestInit} = useCreateShopRequest(body);

  const {data, error: useQueryError} = useQuery<UseShopQueryResponse<T>>(
    key,
    query
      ? fetchBuilder<UseShopQueryResponse<T>>(url, requestInit)
      : // If no query, avoid calling SFAPI & return nothing
        async () => ({data: undefined as unknown as T, errors: undefined}),
    {cache, shouldCacheResponse, preload}
  );

  /**
   * The fetch request itself failed, so we handle that differently than a GraphQL error
   */
  if (useQueryError) {
    const errorMessage = createErrorMessage(useQueryError);

    log.error(errorMessage);
    log.error(useQueryError);

    if (getConfig().dev) {
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

    for (const error of errors) {
      if (getConfig().dev) {
        throw new Error(error.message);
      } else {
        log.error('GraphQL Error', error);
      }
    }
    log.error(`GraphQL errors: ${errors.length}`);
  }

  if (
    __DEV__ &&
    log.options().showUnusedQueryProperties &&
    query &&
    typeof query !== 'string' &&
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

        log.warn(warning);
        sendMessageToClient({type: 'warn', data: warning});
      },
    });
  }

  return data!;
}

function useCreateShopRequest(body: string) {
  const {storeDomain, storefrontToken, storefrontApiVersion} = useShop();

  const request = useServerRequest();
  const secretToken =
    typeof Oxygen !== 'undefined'
      ? Oxygen?.env?.SHOPIFY_STOREFRONT_API_SECRET_TOKEN
      : null;
  const buyerIp = request.getBuyerIp();

  const extraHeaders = {} as Record<string, any>;

  /**
   * Only pass one type of storefront token at a time.
   */
  if (secretToken) {
    extraHeaders['Shopify-Storefront-Private-Token'] = secretToken;
  } else {
    extraHeaders['X-Shopify-Storefront-Access-Token'] = storefrontToken;
  }

  if (buyerIp) {
    extraHeaders['Shopify-Storefront-Buyer-IP'] = buyerIp;
  }

  return {
    key: [storeDomain, storefrontApiVersion, body],
    url: `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`,
    requestInit: {
      body,
      method: 'POST',
      headers: {
        'X-SDK-Variant': 'hydrogen',
        'X-SDK-Version': storefrontApiVersion,
        'content-type': 'application/json',
        ...extraHeaders,
      },
    },
  };
}

function createErrorMessage(fetchError: Response | Error) {
  if (fetchError instanceof Response) {
    return `An error occurred while fetching from the Storefront API. ${
      // 403s to the SF API (almost?) always mean that your Shopify credentials are bad/wrong
      fetchError.status === 403
        ? `You may have a bad value in 'shopify.config.js'`
        : `${fetchError.statusText}`
    }`;
  } else {
    return `Failed to connect to the Storefront API: ${fetchError.message}`;
  }
}
