import React, {useMemo} from 'react';
import {ShopifyContext} from './ShopifyContext';
import {ShopifyProviderProps} from './types';

export const DEFAULT_API_VERSION = 'unstable';

/**
 * The `ShopifyProvider` component wraps your entire app and provides support for hooks.
 * You should place it in your app's entry point component. For example, `<App>`.
 */
export function ShopifyProvider({
  shopifyConfig,
  children,
}: ShopifyProviderProps) {
  const shopifyProviderValue = useMemo(
    () => ({
      locale: 'en-us',
      graphqlApiVersion: DEFAULT_API_VERSION,
      ...shopifyConfig,
      storeDomain: shopifyConfig?.storeDomain?.replace(/^https?:\/\//, ''),
    }),
    [shopifyConfig]
  );

  return (
    <ShopifyContext.Provider value={shopifyProviderValue}>
      {children}
    </ShopifyContext.Provider>
  );
}
