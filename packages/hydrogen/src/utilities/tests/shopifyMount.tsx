import React from 'react';
import {createMount} from '@shopify/react-testing';
import {DEFAULT_API_VERSION} from '../../foundation/constants';
import {ShopifyConfig} from '../../types';
import {ShopifyProvider} from '../../foundation/ShopifyProvider';

export interface ShopifyProviderOptions {
  shopifyConfig?: Partial<ShopifyConfig>;
}

export interface ShopifyProviderContext {
  shopifyConfig: ShopifyConfig;
}

export const mountWithProviders = createMount<
  ShopifyProviderOptions,
  ShopifyProviderContext
>({
  context: (options) => ({
    shopifyConfig: getShopifyConfig(options.shopifyConfig),
  }),
  render: (element, {shopifyConfig}) => (
    <ShopifyProvider shopifyConfig={shopifyConfig}>{element}</ShopifyProvider>
  ),
});

export function getShopifyConfig(config: Partial<ShopifyConfig> = {}) {
  return {
    storeDomain: config.storeDomain ?? 'notashop.myshopify.io',
    storefrontToken: config.storefrontToken ?? 'abc123',
    graphqlApiVersion: config.graphqlApiVersion ?? DEFAULT_API_VERSION,
  };
}
