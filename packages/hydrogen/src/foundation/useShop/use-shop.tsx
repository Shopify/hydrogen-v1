import type {ShopifyConfig} from '../../types';

let config: ShopifyConfig | null = null;

/**
 * The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShop(): ShopifyConfig {
  return config as ShopifyConfig;
}

export function setShopifyConfig(newConfig: ShopifyConfig) {
  config = newConfig;
}
