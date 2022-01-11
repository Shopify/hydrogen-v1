import {useShop} from '../../foundation/useShop';
import {log} from '../../utilities/log';
import {ASTNode} from 'graphql';
import {useQuery} from '../../foundation/useQuery';
import type {CacheOptions} from '../../types';
import {isClient, fetchBuilder, graphqlRequestBody} from '../../utilities';
import {getConfig} from '../../framework/config';

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
  cache = {},
  locale = '',
}: {
  /** A string of the GraphQL query.
   * If no query is provided, useShopQuery will make no calls to the Storefront API.
   */
  query?: ASTNode | string;
  /** An object of the variables for the GraphQL query. */
  variables?: Record<string, any>;
  /** An object containing cache-control options for the sub-request. */
  cache?: CacheOptions;
  locale?: string;
}): UseShopQueryResponse<T> {
  if (isClient()) {
    throw new Error(
      'Shopify Storefront API requests should only be made from the server.'
    );
  }

  const body = query ? graphqlRequestBody(query, variables) : '';
  const {request, key} = createShopRequest(body, locale);

  const {data, error: fetchError} = useQuery<UseShopQueryResponse<T>>(
    key,
    query
      ? fetchBuilder<UseShopQueryResponse<T>>(request)
      : // If no query, avoid calling SFAPI & return nothing
        async () => ({data: undefined as unknown as T, errors: undefined}),
    {cache}
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

function createShopRequest(body: string, locale: string) {
  const {storeDomain, storefrontToken, graphqlApiVersion} = useShop();

  const url = `https://${storeDomain}/api/${graphqlApiVersion}/graphql.json`;

  return {
    request: new Request(url, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontToken,
        'content-type': 'application/json',
        ...(locale ? {'Accept-Language': locale} : null),
      },
      body,
    }),
    key: [storeDomain, graphqlApiVersion, body, locale],
  };
}
