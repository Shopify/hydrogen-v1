import React, {useMemo} from 'react';
import {ShopifyProviderClient} from './ShopifyProvider.client';
import type {ShopifyProviderProps} from './types';
import type {CountryCode, LanguageCode} from '../../storefront-api-types';

import {DEFAULT_LOCALE} from '../constants';
import type {ShopifyContextValue} from './types';
import type {ShopifyConfig} from '../../types';
import {useRequestCacheData, useServerRequest} from '../ServerRequestProvider';
import {useUrl} from '../useUrl';

function makeShopifyContext(shopifyConfig: ShopifyConfig): ShopifyContextValue {
  const locale = shopifyConfig.defaultLocale ?? DEFAULT_LOCALE;
  const languageCode = locale.split(/[-_]/)[0];

  return {
    locale: locale.toUpperCase() as `${LanguageCode}-${CountryCode}`,
    languageCode: languageCode.toUpperCase() as `${LanguageCode}`,
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

  const request = useServerRequest();
  let actualShopifyConfig: ShopifyConfig;

  if (typeof shopifyConfig === 'function') {
    const url = useUrl();
    const result = useRequestCacheData(['hydrogen-shopify-config'], () =>
      Promise.resolve(shopifyConfig(url, request))
    );

    if (result.error) {
      throw new Error(
        `Failed to load Shopify config: ${result.error.statusText}`
      );
    }

    actualShopifyConfig = result.data;
  } else {
    actualShopifyConfig = shopifyConfig;
  }

  const shopifyProviderValue = useMemo(
    () => makeShopifyContext(actualShopifyConfig),
    [actualShopifyConfig]
  );

  request.ctx.shopifyConfig = shopifyProviderValue;

  return (
    <ShopifyProviderClient shopifyConfig={shopifyProviderValue}>
      {children}
    </ShopifyProviderClient>
  );
}
