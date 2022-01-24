// eslint-disable-next-line node/no-extraneous-import
import type {CountryCode} from 'storefront-api-js-client-prototype';
import {useSFAPIClient} from '../../foundation/useSFAPIClient';
import {useShopQuery} from '../useShopQuery';

const DEFAULT_QUERY_CONFIG = {
  includeVariants: true,
  includeCompareAtPrices: false,
  includeMedia: true,
  includeMetafields: true,
  includeMetafieldReference: false,
  includeUnitPrice: false,
  includeWeight: false,
  includeStoreUrls: false,
  includeSeo: true,
  numMetafields: 250,
  numVariantMetafields: 250,
  media: {count: 10},
  variants: {count: 250},
  sellingGroups: {count: 10},
  sellingGroupsPlans: {count: 10},
  productVariantSellingPlanAllocations: {count: 10},
};

export function useProductQuery({
  handle,
  country,
}: {
  handle: string;
  country: CountryCode;
}): any {
  const SFAPIClient = useSFAPIClient();

  const {gql, variables} = SFAPIClient.product.queryProduct({
    handle,
    queryConfig: DEFAULT_QUERY_CONFIG,
    country,
  });
  const data = useShopQuery({query: gql, variables});
  return data;
}
