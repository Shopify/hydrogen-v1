// eslint-disable-next-line node/no-extraneous-import
import type {CountryCode} from 'storefront-api-js-client-prototype';
import {useSFAPIClient} from '../../foundation/useSFAPIClient';
import {useShopQuery} from '../useShopQuery';

export function useMultipleCollectionsQuery({
  country,
  numCollections = 2,
  numProducts = 3,
  numMedia = 1,
}: {
  country: CountryCode;
  numCollections?: number;
  numProducts?: number;
  numMedia?: number;
}): any {
  const SFAPIClient = useSFAPIClient();
  const {gql, variables} = SFAPIClient.collection.queryAllCollections({
    count: numCollections,
    country,
    queryConfig: {
      includeVariants: true,
      products: {
        count: numProducts,
      },
      media: {
        count: numMedia,
      },
    },
  });
  const data = useShopQuery({query: gql, variables});
  return data;
}
