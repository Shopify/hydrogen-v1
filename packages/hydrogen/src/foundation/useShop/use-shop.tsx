import {ShopifyContext} from '../ShopifyProvider';
import {useEnvContext} from '../ssr-interop';

/**
 * The `useShop` hook provides access to values within the `shopify` property in the `hydrogen.config.js` file. 
 * The `useShop` hook must be a descendent of a `ShopifyProvider` component.
 */
export function useShop() {
  const config = useEnvContext((req) => req.ctx.shopifyConfig, ShopifyContext);

  if (!config) {
    throw new Error('No Shopify Context found');
  }

  return config;
}
