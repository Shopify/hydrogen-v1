import React, {useMemo} from 'react';
import {ShopifyContext, makeShopifyContext} from './ShopifyContext';
import type {ShopifyProviderProps} from './types';

/**
 * The `ShopifyProvider` component wraps your entire app and provides support for hooks.
 * You should place it in your app's entry point component. For example, `<App>`.
 * If you're using the Hydrogen framework, you don't need to add this provider
 * because it's automatically wrapped around your app in `renderHydrogen()`.
 */
export function ShopifyProvider({
  shopifyConfig,
  children,
}: ShopifyProviderProps) {
  const shopifyProviderValue = useMemo(
    () => makeShopifyContext(shopifyConfig),
    [shopifyConfig]
  );

  return (
    <ShopifyContext.Provider value={shopifyProviderValue}>
      {children}
    </ShopifyContext.Provider>
  );
}
