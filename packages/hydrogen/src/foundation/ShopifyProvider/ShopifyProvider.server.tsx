import React, {useMemo} from 'react';
import {ShopifyProviderClient} from './ShopifyProvider.client';
import type {ShopifyProviderProps, LocalizationContextValue} from './types';
import type {CountryCode, LanguageCode} from '../../storefront-api-types';

import {DEFAULT_COUNTRY, DEFAULT_LANGUAGE} from '../constants';
import type {ShopifyContextValue} from './types';
import type {ShopifyConfig, ShopifyConfigFetcher} from '../../types';
import {useRequestCacheData, useServerRequest} from '../ServerRequestProvider';
import {getOxygenVariable} from '../../utilities/storefrontApi';
import {SHOPIFY_STOREFRONT_ID_VARIABLE} from '../../constants';
import {getLocale} from '../../utilities/locale';

function makeShopifyContext(shopifyConfig: ShopifyConfig): ShopifyContextValue {
  const countryCode = shopifyConfig.defaultCountryCode ?? DEFAULT_COUNTRY;
  const languageCode = shopifyConfig.defaultLanguageCode ?? DEFAULT_LANGUAGE;
  const storefrontId = getOxygenVariable(SHOPIFY_STOREFRONT_ID_VARIABLE);

  return {
    defaultCountryCode: countryCode.toUpperCase() as `${CountryCode}`,
    defaultLanguageCode: languageCode.toUpperCase() as `${LanguageCode}`,
    storeDomain: shopifyConfig?.storeDomain?.replace(/^https?:\/\//, ''),
    storefrontToken: shopifyConfig.storefrontToken,
    storefrontApiVersion: shopifyConfig.storefrontApiVersion,
    multipassSecret: shopifyConfig.multipassSecret,
    storefrontId,
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
  /**
   * Shopify connection information. Defaults to
   * [the `shopify` property in the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config).
   */
  shopifyConfig,

  countryCode,

  languageCode,

  /** Any `ReactNode` elements. */
  children,
}: ShopifyProviderProps): JSX.Element {
  const request = useServerRequest();

  if (!shopifyConfig) {
    shopifyConfig = request.ctx.hydrogenConfig?.shopify;

    if (!shopifyConfig) {
      throw new Error(
        'The `shopifyConfig` prop should be passed to `ShopifyProvider`'
      );
    }
  }

  let actualShopifyConfig: ShopifyConfig;

  if (typeof shopifyConfig === 'function') {
    const result = useRequestCacheData(['hydrogen-shopify-config'], () =>
      (shopifyConfig as ShopifyConfigFetcher)(request)
    );

    if (result.error) {
      if (result.error instanceof Error) {
        throw result.error;
      }

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

  const localization = getLocalizationContextValue(
    shopifyProviderValue.defaultLanguageCode,
    shopifyProviderValue.defaultCountryCode,
    languageCode,
    countryCode
  );

  request.ctx.localization = localization;
  request.ctx.shopifyConfig = shopifyProviderValue;

  return (
    <ShopifyProviderClient
      shopifyConfig={shopifyProviderValue}
      localization={localization}
    >
      {children}
    </ShopifyProviderClient>
  );
}

export function getLocalizationContextValue(
  defaultLanguageCode: `${LanguageCode}`,
  defaultCountryCode: `${CountryCode}`,
  languageCode?: `${LanguageCode}`,
  countryCode?: `${CountryCode}`
): LocalizationContextValue {
  return useMemo(() => {
    const runtimeLanguageCode = (
      languageCode ?? defaultLanguageCode
    ).toUpperCase() as `${LanguageCode}`;
    const runtimeCountryCode = (
      countryCode ?? defaultCountryCode
    ).toUpperCase() as `${CountryCode}`;

    return {
      country: {
        isoCode: runtimeCountryCode,
      },
      language: {
        isoCode: runtimeLanguageCode,
      },
      locale: getLocale(runtimeLanguageCode, runtimeCountryCode),
    };
  }, [defaultLanguageCode, defaultCountryCode, countryCode, languageCode]);
}
