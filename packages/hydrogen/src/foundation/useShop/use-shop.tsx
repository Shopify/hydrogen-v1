import {useContext} from 'react';
import {ShopifyProviderValue} from '../ShopifyProvider/types';
import {ShopifyContext} from '../ShopifyProvider/ShopifyContext';

/**
 * The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShop(): ShopifyProviderValue {
  const context = useContext(ShopifyContext);

  if (!context) {
    throw new Error('No Shopify Context found');
  }

  return context;
}
