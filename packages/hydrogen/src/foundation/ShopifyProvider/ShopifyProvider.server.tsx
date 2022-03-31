import React, {useMemo} from 'react';
import {ShopifyProviderClient} from './ShopifyProvider.client';
import type {ShopifyProviderProps} from './types';

import {DEFAULT_LOCALE} from '../constants';
import type {ShopifyContextValue} from './types';
import type {ShopifyConfig} from '../../types';
import {useServerRequest} from '../ServerRequestProvider';

function makeShopifyContext(shopifyConfig: ShopifyConfig): ShopifyContextValue {
  const locale = shopifyConfig.defaultLocale ?? DEFAULT_LOCALE;
  const languageCode = locale.split(/[-_]/)[0];

  return {
    locale,
    languageCode,
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
  if (!shopifyConfig) {
    throw new Error(
      'The `shopifyConfig` prop should be passed to `ShopifyProvider`'
    );
  }

  const shopifyProviderValue = useMemo(
    () => makeShopifyContext(shopifyConfig),
    [shopifyConfig]
  );

  const request = useServerRequest();
  request.ctx.shopifyConfig = shopifyProviderValue;

  return (
    <ShopifyProviderClient shopifyConfig={shopifyProviderValue}>
      {children}
    </ShopifyProviderClient>
  );
}
