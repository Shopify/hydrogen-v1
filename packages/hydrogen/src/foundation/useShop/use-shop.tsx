import {useContext} from 'react';
import {
  ShopifyContext,
  makeShopifyContext,
} from '../ShopifyProvider/ShopifyContext';
import type {ShopifyContextValue} from '../ShopifyProvider/types';
import type {ShopifyConfig} from '../../types';

let contextValue: ShopifyContextValue | null = null;

/**
 * The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShop(): ShopifyContextValue {
  /**
   * During RSC, context is not (yet) allowed on Server Component, so we should be calling `setShop`
   * in server and returning the object here.
   */
  if (contextValue) {
    return contextValue;
  }

  const context = useContext(ShopifyContext);

  if (!context) {
    throw new Error('No Shopify Context found');
  }

  return context;
}

export function setShop(shopifyConfig: ShopifyConfig) {
  contextValue = makeShopifyContext(shopifyConfig);
}
