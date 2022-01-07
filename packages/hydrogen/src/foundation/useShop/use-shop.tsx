import {ShopifyProviderValue} from '../ShopifyProvider/types';

let config: ShopifyProviderValue | null = null;

/**
 * The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShop(): ShopifyProviderValue {
  return config as ShopifyProviderValue;
}

export function setShopifyConfig(newConfig: ShopifyProviderValue) {
  config = newConfig;
}
