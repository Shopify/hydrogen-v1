import {useShop} from '../../foundation/useShop';
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
 * The `useShopQuery` hook allows you to make server-only GraphQL queries to the Storefront API.
 * \> Note:
 * \> It must be a descendent of a `ShopifyProvider` component.
 */
export function useShopQuery<T>({
  query,
  variables = {},
  cache = {},
}: {
  /** A string of the GraphQL query. */
  query: ASTNode | string;
  /** An object of the variables for the GraphQL query. */
  variables?: Record<string, any>;
  /** An object containing cache-control options for the sub-request. */
  cache?: CacheOptions;
}): UseShopQueryResponse<T> {
  if (isClient()) {
    throw new Error(
      'Shopify Storefront API requests should only be made from the server.'
    );
  }

  const {storeDomain, storefrontToken, graphqlApiVersion} = useShop();

  const body = graphqlRequestBody(query, variables);
  const url = `https://${storeDomain}/api/${graphqlApiVersion}/graphql.json`;
  const request = new Request(url, {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontToken,
      'content-type': 'application/json',
    },
    body,
  });

  const result = useQuery<UseShopQueryResponse<T>>(
    [storeDomain, graphqlApiVersion, body],
    fetchBuilder<UseShopQueryResponse<T>>(request),
    {cache}
  );

  /**
   * GraphQL errors get printed to the console but ultimately
   * get returned to the consumer.
   */
  if (result.errors) {
    const errors =
      result.errors instanceof Array ? result.errors : [result.errors];
    for (const error of errors) {
      console.error('GraphQL Error', error);

      if (getConfig().dev) {
        throw new Error(error.message);
      }
    }
    console.error(`GraphQL errors: ${errors.length}`);
  }

  return result as UseShopQueryResponse<T>;
}
