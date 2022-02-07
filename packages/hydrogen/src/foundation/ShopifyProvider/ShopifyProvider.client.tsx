import type {ShopifyContextValue} from './types';
import React, {createContext, ReactNode} from 'react';

export const ShopifyContext = createContext<ShopifyContextValue | null>(null);

export function ShopifyProviderClient({
  children,
  shopifyConfig,
}: {
  children: ReactNode;
  shopifyConfig: ShopifyContextValue;
}): JSX.Element {
  return (
    <ShopifyContext.Provider value={shopifyConfig}>
      {children}
    </ShopifyContext.Provider>
  );
}
