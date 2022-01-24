/* eslint-disable node/no-extraneous-import */
import type {
  CountryCode,
  CustomGraphQLFragment,
  ProductsQueryQuery,
  Cursor,
} from 'storefront-api-js-client-prototype';
import {useSFAPIClient} from '../../foundation/useSFAPIClient';
import {useShopQuery} from '../useShopQuery';

const DEFAULT_QUERY_CONFIG = {
  includeVariants: true,
  includeCompareAtPrices: false,
  includeMedia: true,
  includeMetafields: false,
  includeMetafieldReference: false,
  includeUnitPrice: false,
  includeWeight: false,
  includeStoreUrls: false,
  includeSeo: false,
  numMetafields: 250,
  numVariantMetafields: 250,
  media: {count: 5},
  variants: {count: 250},
  sellingGroups: {count: 10},
  sellingGroupsPlans: {count: 10},
  productVariantSellingPlanAllocations: {count: 10},
};

export function useMultipleProductsQuery({
  numProducts,
  customFragment,
  country,
  cursor,
  paginationDirection = 'next',
}: {
  numProducts: number;
  country: CountryCode;
  customFragment?: CustomGraphQLFragment;
  cursor?: string;
  paginationDirection?: 'next' | 'previous';
}) {
  const SFAPIClient = useSFAPIClient();

  const cursorConfig: Cursor | undefined = cursor
    ? {
        value: cursor,
        getNodesBeforeAfterCursor:
          paginationDirection === 'next' ? 'afterCursor' : 'beforeCursor',
      }
    : undefined;

  const {gql, variables} = SFAPIClient.product.queryAllProducts({
    count: numProducts,
    queryConfig: DEFAULT_QUERY_CONFIG,
    cursor: cursorConfig,
    customFragment,
    country,
  });
  const {data} = useShopQuery<ProductsQueryQuery>({query: gql, variables});

  const getNextPage = data.products.pageInfo.hasNextPage
    ? () => {
        const cursor = data.products.edges.at(-1)?.cursor;
        return useMultipleProductsQuery({
          numProducts,
          customFragment,
          country,
          cursor,
          paginationDirection: 'next',
        });
      }
    : null;

  const getPreviousPage = data.products.pageInfo.hasPreviousPage
    ? () => {
        const cursor = data.products.edges[0]?.cursor;
        return useMultipleProductsQuery({
          numProducts,
          customFragment,
          country,
          cursor,
          paginationDirection: 'previous',
        });
      }
    : null;

  return {
    data,
    getNextPage,
    getPreviousPage,
  };
}
