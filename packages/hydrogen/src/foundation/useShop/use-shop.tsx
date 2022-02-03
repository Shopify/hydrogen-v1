import {useContext} from 'react';
import {ShopifyContext} from '../ShopifyProvider';
import {useServerRequest} from '../ServerRequestProvider';

// let contextValue: ShopifyContextValue | null = null;

/**
 * The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShop() {
  const config = import.meta.env.SSR
    ? useServerRequest().ctx.shopifyConfig
    : useContext(ShopifyContext);

  if (!config) {
    throw new Error('No Shopify Context found');
  }

  return config;
}
