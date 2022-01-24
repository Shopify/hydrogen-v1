/* eslint-disable node/no-extraneous-import */
import type {
  CountryCode,
  CustomGraphQLFragment,
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
}: {
  numProducts: number;
  country: CountryCode;
  customFragment?: CustomGraphQLFragment;
}): any {
  const SFAPIClient = useSFAPIClient();
  const {gql, variables} = SFAPIClient.product.queryAllProducts({
    count: numProducts,
    queryConfig: DEFAULT_QUERY_CONFIG,
    customFragment,
    country,
  });
  const data = useShopQuery({query: gql, variables});
  console.log('in all products', data);
  return data;
}
