import type {ShopifyContextValue} from './types';
import React, {createContext, ReactNode} from 'react';

// TODO: Two versions of context are loading again, since Vite is appending a `?t`
// query param to some, and not to others.
// @ts-expect-error need to define these
globalThis.shopifyContext ||= createContext<ShopifyContextValue | null>(null);

// @ts-ignore
export const ShopifyContext = globalThis.shopifyContext;

export function ShopifyProviderClient({
  children,
  shopifyConfig,
}: {
  children: ReactNode;
  shopifyConfig: ShopifyContextValue;
}): JSX.Element {
  if (!shopifyConfig) {
    throw new Error(
      'The `shopifyConfig` prop should be passed to `ShopifyProvider`'
    );
  }

  return (
    <ShopifyContext.Provider value={shopifyConfig}>
      {children}
    </ShopifyContext.Provider>
  );
}
