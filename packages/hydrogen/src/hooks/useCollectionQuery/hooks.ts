// eslint-disable-next-line node/no-extraneous-import
import type {CountryCode} from 'storefront-api-js-client-prototype';
import {useSFAPIClient} from '../../foundation/useSFAPIClient';
import {useShopQuery} from '../useShopQuery';

export function useCollectionQuery({
  handle,
  country,
  numProducts,
}: {
  handle: string;
  country: CountryCode;
  numProducts: number;
}): any {
  const SFAPIClient = useSFAPIClient();
  const {gql, variables} = SFAPIClient.collection.queryCollection({
    handle,
    country,
    queryConfig: {
      includeVariants: true,
      products: {
        count: numProducts,
      },
    },
  });
  const data = useShopQuery({query: gql, variables});
  console.log('in collection query', data);

  return data;
}
