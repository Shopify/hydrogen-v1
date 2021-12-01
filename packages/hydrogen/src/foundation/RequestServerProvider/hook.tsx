import {useContext} from 'react';
import {RequestProviderProps} from './types';
import {RequestContext} from './RequestContext';

/**
 * The `useShop` hook provides access to values within `shopify.config.js`.The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component.
 */
export function useRequest(): RequestProviderProps {
  const context = useContext(RequestContext);

  if (!context) {
    throw new Error('No Request Context found');
  }

  return context;
}
