// eslint-disable-next-line node/no-extraneous-import
import type {CountryCode} from 'storefront-api-js-client-prototype';
import {useSFAPIClient} from '../../foundation/useSFAPIClient';
import {useShopQuery} from '../useShopQuery';

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
    queryConfig: {
      includeSeo: true,
      includeMetafields: true,
    },
    country,
  });
  const data = useShopQuery({query: gql, variables});
  // console.log('product', data);
  return data;
}
