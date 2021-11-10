import {ASTNode} from 'graphql';
import {
  isClient,
  useShop,
  useQuery,
  fetchBuilder,
  graphqlRequestBody,
  UseShopQueryResponse,
} from '@shopify/hydrogen';

/**
 * Copy of Hydrogen's default useShopQuery that allows you to pass an `undefined` query for not fetching any data.
 * Is required by @shopify/hydrogen-plugin-sanity because we won't always have data to query from Shopify, and can't break the Rules of Hooks by not calling `useShopQuery` when that isn't needed.
 */
export function useSkippableShopQuery<T>({
  query,
  variables = {},
}: {
  /** A string of the GraphQL query. */
  query: ASTNode | string | undefined;

  /** An object of the variables for the GraphQL query. */
  variables?: {[key: string]: any};
}): UseShopQueryResponse<T> {
  if (isClient()) {
    throw new Error(
      'Shopify Storefront API requests should only be made from the server.'
    );
  }

  const {storeDomain, storefrontToken, graphqlApiVersion} = useShop();

  const body = query ? graphqlRequestBody(query, variables) : undefined;
  const url = `https://${storeDomain}/api/${graphqlApiVersion}/graphql.json`;
  const request = new Request(url, {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontToken,
      'content-type': 'application/json',
    },
    body,
  });

  const {data} = useQuery<UseShopQueryResponse<T | undefined>>(
    [storeDomain, graphqlApiVersion, body],
    query
      ? fetchBuilder<UseShopQueryResponse<T>>(request)
      : // If no query, return nothing
        async () => ({data: undefined, errors: undefined})
  );

  /**
   * GraphQL errors get printed to the console but ultimately
   * get returned to the consumer.
   */
  if (data?.errors) {
    const errors = data.errors instanceof Array ? data.errors : [data.errors];
    for (const error of errors) {
      console.error('GraphQL Error', error);
    }
    console.error(`GraphQL errors: ${errors.length}`);
  }

  return data as UseShopQueryResponse<T>;
}
