import React from 'react';
import {createMount} from '@shopify/react-testing';
import {DEFAULT_API_VERSION} from '../../foundation';
import {ShopifyConfig} from '../../types';

export interface ShopifyProviderOptions {}
export interface ShopifyProviderContext {}

export const mountWithShopifyProvider = createMount<
  ShopifyProviderOptions,
  ShopifyProviderContext
>({
  context: (options) => ({}),
  render: (element, {}) => <React.Fragment>{element}</React.Fragment>,
});

export function getShopifyConfig(config: Partial<ShopifyConfig> = {}) {
  return {
    storeDomain: config.storeDomain ?? 'notashop.myshopify.io',
    storefrontToken: config.storefrontToken ?? 'abc123',
    graphqlApiVersion: config.graphqlApiVersion ?? DEFAULT_API_VERSION,
  };
}
