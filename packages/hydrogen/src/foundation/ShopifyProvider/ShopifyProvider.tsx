import React, {useMemo} from 'react';
// import {ShopifyContext, makeShopifyContext} from './ShopifyContext';
import type {ShopifyProviderProps} from './types';

import {createContext} from 'react';
import {DEFAULT_LOCALE} from '../constants';
import type {ShopifyContextValue} from './types';
import type {ShopifyConfig} from '../../types';
import {useServerRequest} from '../ServerRequestProvider';

export const ShopifyContext = createContext<ShopifyContextValue | null>(null);

function makeShopifyContext(shopifyConfig: ShopifyConfig): ShopifyContextValue {
  return {
    locale: shopifyConfig.defaultLocale ?? DEFAULT_LOCALE,
    storeDomain: shopifyConfig?.storeDomain?.replace(/^https?:\/\//, ''),
    storefrontToken: shopifyConfig.storefrontToken,
    storefrontApiVersion: shopifyConfig.storefrontApiVersion,
  };
}

export const SHOPIFY_PROVIDER_CONTEXT_KEY = Symbol.for('SHOPIFY_PROVIDER_RSC');

/**
 * The `ShopifyProvider` component wraps your entire app and provides support for hooks.
 * You should place it in your app's entry point component. For example, `<App>`.
 * If you're using the Hydrogen framework, you don't need to add this provider
 * because it's automatically wrapped around your app in `renderHydrogen()`.
 */
export function ShopifyProvider({
  shopifyConfig,
  children,
}: ShopifyProviderProps): JSX.Element {
  const shopifyProviderValue = useMemo(
    () => makeShopifyContext(shopifyConfig),
    [shopifyConfig]
  );

  if (import.meta.env.SSR) {
    const request = useServerRequest();
    request.ctx.shopifyConfig = shopifyProviderValue;
    return <>{children}</>;
  }

  return (
    <ShopifyContext.Provider value={shopifyProviderValue}>
      {children}
    </ShopifyContext.Provider>
  );
}
