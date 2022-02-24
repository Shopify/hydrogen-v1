import {useShop} from '../../foundation/useShop';
import {getLoggerWithContext} from '../../utilities/log';
import {ASTNode} from 'graphql';
import {useQuery} from '../../foundation/useQuery';
import type {CachingStrategy, PreloadOptions} from '../../types';
import {fetchBuilder, graphqlRequestBody} from '../../utilities';
import {getConfig} from '../../framework/config';
import {useServerRequest} from '../../foundation/ServerRequestProvider';

export interface UseShopQueryResponse<T> {
  /** The data returned by the query. */
  data: T;
  errors: any;
}

/**
 * The `useShopQuery` hook allows you to make server-only GraphQL queries to the Storefront API. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShopQuery<T>({
  query,
  variables = {},
  cache,
  locale = '',
  preload = false,
}: {
  /** A string of the GraphQL query.
   * If no query is provided, useShopQuery will make no calls to the Storefront API.
   */
  query?: ASTNode | string;
  /** An object of the variables for the GraphQL query. */
  variables?: Record<string, any>;
  /** An object containing cache-control options for the sub-request. */
  cache?: CachingStrategy;
  /** A string corresponding to a valid locale identifier like `en-us` used to make the request. */
  locale?: string;
  /** Whether to preload the query. Defaults to `false`. Specify `true` to
   * preload the query for the URL or `'*'` to preload the query for all requests.
   */
  preload?: PreloadOptions;
}): UseShopQueryResponse<T> {
  if (!import.meta.env.SSR) {
    throw new Error(
      'Shopify Storefront API requests should only be made from the server.'
    );
  }

  const serverRequest = useServerRequest();
  const log = getLoggerWithContext(serverRequest);

  const body = query ? graphqlRequestBody(query, variables) : '';
  const {request, key} = createShopRequest(body, locale);

  const {data, error: fetchError} = useQuery<UseShopQueryResponse<T>>(
    key,
    query
      ? fetchBuilder<UseShopQueryResponse<T>>(request)
      : // If no query, avoid calling SFAPI & return nothing
        async () => ({data: undefined as unknown as T, errors: undefined}),
    {cache, preload}
  );

  /**
   * The fetch request itself failed, so we handle that differently than a GraphQL error
   */
  if (fetchError) {
    const errorMessage = `Failed to fetch the Storefront API. ${
      // 403s to the SF API (almost?) always mean that your Shopify credentials are bad/wrong
      fetchError.status === 403
        ? `You may have a bad value in 'shopify.config.js'`
        : `${fetchError.statusText}`
    }`;

    log.error(errorMessage);

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
    const errors = data.errors instanceof Array ? data.errors : [data.errors];
    for (const error of errors) {
      if (getConfig().dev) {
        throw new Error(error.message);
      } else {
        log.error('GraphQL Error', error);
      }
    }
    log.error(`GraphQL errors: ${errors.length}`);
  }

  return data as UseShopQueryResponse<T>;
}

function createShopRequest(body: string, locale?: string) {
  const {
    storeDomain,
    storefrontToken,
    storefrontApiVersion,
    locale: defaultLocale,
  } = useShop();

  const url = `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`;

  return {
    request: new Request(url, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontToken,
        'content-type': 'application/json',
        'Accept-Language': (locale as string) ?? defaultLocale,
      },
      body,
    }),
    key: [storeDomain, storefrontApiVersion, body, locale],
  };
}
