import {useShop} from '../../foundation/useShop';
import {ASTNode} from 'graphql';
import {useQuery, preloadQuery} from '../../foundation/useQuery';
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
  /** A string of the GraphQL query.
   * If no query is provided, useShopQuery will make no calls to the Storefront API.
   */
  query?: ASTNode | string;
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

  const body = query ? graphqlRequestBody(query, variables) : '';
  const {request, key} = createShopRquest(body);

  const result = useQuery<UseShopQueryResponse<T>>(
    key,
    query
      ? fetchBuilder<UseShopQueryResponse<T>>(request)
      : async () => ({data: undefined as unknown as T, errors: undefined}),
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

export function preloadShopQuery<T>({
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
}): void {
  if (isClient()) {
    throw new Error(
      'Shopify Storefront API requests should only be made from the server.'
    );
  }
  const body = graphqlRequestBody(query, variables);
  const {request, key} = createShopRquest(body);

  preloadQuery<UseShopQueryResponse<T>>(
    key,
    fetchBuilder<UseShopQueryResponse<T>>(request),
    {cache}
  );
}

function createShopRquest(body: string) {
  const {storeDomain, storefrontToken, graphqlApiVersion} = useShop();

  const url = `https://${storeDomain}/api/${graphqlApiVersion}/graphql.json`;

  return {
    request: new Request(url, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontToken,
        'content-type': 'application/json',
      },
      body,
    }),
    key: [storeDomain, graphqlApiVersion, body],
  };
}
