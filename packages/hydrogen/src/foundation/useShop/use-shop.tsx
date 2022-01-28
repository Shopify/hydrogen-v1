import React, {useContext} from 'react';
import {ShopifyContext} from '../ShopifyProvider';
import type {ShopifyContextValue} from '../ShopifyProvider/types';
import {shopifyProviderRSC} from '../ShopifyProvider/ShopifyProvider';

// let contextValue: ShopifyContextValue | null = null;

/**
 * The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShop(): ShopifyContextValue {
  let context: ShopifyContextValue | null;
  try {
    // Context only works in SSR rendering
    context = useContext(ShopifyContext);
  } catch (error) {
    // If normal context failed it means this is not an SSR request.
    // Try getting RSC cache instead:
    // @ts-ignore
    const cache = React.unstable_getCacheForType(shopifyProviderRSC);
    context = cache ? cache.get(shopifyProviderRSC.key) : null;
  }

  if (!context) {
    throw new Error('No Shopify Context found');
  }

  return context;
}
