import type {ShopifyContextValue, LocalizationContextValue} from './types';
import React, {createContext, ReactNode} from 'react';

export const ShopifyContext = createContext<ShopifyContextValue | null>(null);
export const LocalizationContext =
  createContext<LocalizationContextValue | null>(null);

export function ShopifyProviderClient({
  children,
  shopifyConfig,
  localization,
}: {
  children: ReactNode;
  shopifyConfig: ShopifyContextValue;
  localization: LocalizationContextValue;
}): JSX.Element {
  if (!shopifyConfig) {
    throw new Error(
      'The `shopifyConfig` prop should be passed to `ShopifyProvider`'
    );
  }

  return (
    <ShopifyContext.Provider value={shopifyConfig}>
      <LocalizationContext.Provider value={localization}>
        {children}
      </LocalizationContext.Provider>
    </ShopifyContext.Provider>
  );
}
