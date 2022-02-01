import {useContext} from 'react';
import type {ShopifyContextValue} from '../ShopifyProvider/types';
import type {ShopifyConfig} from '../../types';
import {useServerRequest} from '../ServerRequestProvider';
import {DEFAULT_LOCALE} from '../constants';
import {ShopifyContext} from '../ShopifyProvider/ShopifyContext';

/**
 * The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShop(): ShopifyContextValue {
  const {
    ctx: {shopifyConfig},
  } = useServerRequest();

  // This should be available in RSC
  if (shopifyConfig) return shopifyConfig;

  const context = useContext(ShopifyContext);

  if (!context) {
    throw new Error('No Shopify Context found');
  }

  return context;
}

export function makeShopifyContext(
  shopifyConfig: ShopifyConfig
): ShopifyContextValue {
  return {
    locale: shopifyConfig.defaultLocale ?? DEFAULT_LOCALE,
    storeDomain: shopifyConfig?.storeDomain?.replace(/^https?:\/\//, ''),
    storefrontToken: shopifyConfig.storefrontToken,
    storefrontApiVersion: shopifyConfig.storefrontApiVersion,
  };
}
