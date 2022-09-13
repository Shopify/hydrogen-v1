import type {
  ShopifyContextClientValue,
  LocalizationContextValue,
} from './types.js';
import React, {createContext, ReactNode} from 'react';

export const ShopifyContext = createContext<ShopifyContextClientValue | null>(
  null
);
export const LocalizationContext =
  createContext<LocalizationContextValue | null>(null);

export function ShopifyProviderClient({
  children,
  shopifyConfig,
  localization,
}: {
  children: ReactNode;
  shopifyConfig: ShopifyContextClientValue;
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
