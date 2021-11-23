import React from 'react';
import {createMount} from '@shopify/react-testing';
import {
  DEFAULT_API_VERSION,
  ShopifyProvider,
} from '../../foundation/ShopifyProvider';
import {ShopifyConfig} from '../../types';

export interface ShopifyProviderOptions {
  shopifyConfig?: Partial<ShopifyConfig>;
}

export interface ShopifyProviderContext {
  shopifyConfig: ShopifyConfig;
}

export const mountWithShopifyProvider = createMount<
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
