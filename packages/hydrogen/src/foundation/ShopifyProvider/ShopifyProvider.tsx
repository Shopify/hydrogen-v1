import React, {useMemo} from 'react';
import {ShopifyContext} from './ShopifyContext';
import {ShopifyProviderProps} from './types';
import {DEFAULT_API_VERSION} from './consts';

export {DEFAULT_API_VERSION} from './consts';

/**
 * The `ShopifyProvider` component wraps your entire app and provides support for hooks.
 * You should place it in your app's entry point component. For example, `<App>`.
 */
export function ShopifyProvider({
  shopifyConfig,
  children,
}: ShopifyProviderProps) {
  if (!shopifyConfig) {
    throw new Error(
      'The `shopifyConfig` prop should be passed to `ShopifyProvider`'
    );
  }

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
