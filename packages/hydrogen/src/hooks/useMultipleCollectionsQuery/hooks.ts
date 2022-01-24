// eslint-disable-next-line node/no-extraneous-import
import type {CountryCode} from 'storefront-api-js-client-prototype';
import {useSFAPIClient} from '../../foundation/useSFAPIClient';
import {useShopQuery} from '../useShopQuery';

const DEFAULT_QUERY_CONFIG = {
  includeProducts: true,
  includeVariants: true,
  includeCompareAtPrices: false,
  includeMedia: false,
  includeMetafields: false,
  includeMetafieldReference: false,
  includeUnitPrice: false,
  includeWeight: false,
  includeStoreUrls: false,
  includeSeo: false,
  numMetafields: 250,
  numVariantMetafields: 250,
  products: {count: 3},
  media: {count: 1},
  variants: {count: 250},
  sellingGroups: {count: 10},
  sellingGroupsPlans: {count: 10},
  productVariantSellingPlanAllocations: {count: 10},
};

export function useMultipleCollectionsQuery({
  country,
  numCollections = 2,
  numProducts = DEFAULT_QUERY_CONFIG.products.count,
  numMedia = DEFAULT_QUERY_CONFIG.media.count,
}: {
  country: CountryCode;
  numCollections?: number;
  numProducts?: number;
  numMedia?: number;
}): any {
  const SFAPIClient = useSFAPIClient();

  const queryConfig = {
    ...DEFAULT_QUERY_CONFIG,
    products: {count: numProducts},
    media: {count: numMedia},
  };

  const {gql, variables} = SFAPIClient.collection.queryAllCollections({
    count: numCollections,
    country,
    queryConfig,
  });
  const data = useShopQuery({query: gql, variables});
  return data;
}
