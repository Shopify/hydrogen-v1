import {useContext} from 'react';
import {ShopifyContext} from '../ShopifyProvider';
import type {ShopifyContextValue} from '../ShopifyProvider/types';
import {
  NoServerRequestContext,
  useServerRequest,
} from '../ServerRequestProvider';

// let contextValue: ShopifyContextValue | null = null;

/**
 * The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component.
 */
export function useShop(): ShopifyContextValue {
  let config: ShopifyContextValue | null = null;

  try {
    const request = useServerRequest();
    config = request?.ctx?.shopifyConfig;
  } catch (e) {
    if (!(e instanceof NoServerRequestContext)) {
      throw e;
    }
  }

  if (!config) {
    config = useContext(ShopifyContext);
  }

  if (!config) {
    throw new Error('No Shopify Context found');
  }

  return config;
}
