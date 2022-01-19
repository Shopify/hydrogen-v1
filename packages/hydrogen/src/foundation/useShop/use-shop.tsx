import {useContext} from 'react';
import type {ShopifyConfig} from '../../types';
import {ShopifyContext} from '../ShopifyProvider/ShopifyContext';

let config: ShopifyConfig | null = null;

/**
 * The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShop(): ShopifyConfig {
  /**
   * During RSC, context is not (yet) allowed, so we should be calling `setShopifyConfig`
   * and returning the object here.
   */
  if (config) {
    return config as ShopifyConfig;
  }

  return useContext(ShopifyContext) as ShopifyConfig;
}

export function setShopifyConfig(newConfig: ShopifyConfig) {
  config = newConfig;
}
