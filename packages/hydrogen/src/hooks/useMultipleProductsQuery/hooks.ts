/* eslint-disable node/no-extraneous-import */
import type {
  CountryCode,
  CustomGraphQLFragment,
} from 'storefront-api-js-client-prototype';
import {useSFAPIClient} from '../../foundation/useSFAPIClient';
import {useShopQuery} from '../useShopQuery';

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
    customFragment,
    country,
  });
  const data = useShopQuery({query: gql, variables});
  console.log('in all products', data);
  return data;
}
