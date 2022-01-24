/* eslint-disable node/no-extraneous-import */
import {createStorefrontAPIQueryBuilder} from 'storefront-api-js-client-prototype';
import type {StorefrontAPIQueryBuilder} from 'storefront-api-js-client-prototype';
import type {ShopifyConfig} from '../../types';
export {
  CountryCode,
  CustomGraphQLFragment,
} from 'storefront-api-js-client-prototype';

let SFAPIClient: StorefrontAPIQueryBuilder | null = null;

export function useSFAPIClient(): StorefrontAPIQueryBuilder {
  return SFAPIClient as StorefrontAPIQueryBuilder;
}

export function setSFAPIClient(
  newConfig: ShopifyConfig,
  subscriptions = false
) {
  SFAPIClient = createStorefrontAPIQueryBuilder({
    storeUrl: newConfig.storeDomain,
    storefrontAPIAccessToken: newConfig.storefrontToken,
    subscriptions,
  });
}
