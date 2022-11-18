import React, {useMemo} from 'react';
import {ShopifyProviderClient} from './ShopifyProvider.client.js';
import type {
  ShopifyProviderProps,
  LocalizationContextValue,
  ShopifyContextServerValue,
  ShopifyContextClientValue,
} from './types.js';
import type {CountryCode, LanguageCode} from '../../storefront-api-types.js';

import {DEFAULT_COUNTRY, DEFAULT_LANGUAGE} from '../constants.js';
import type {ShopifyConfig, ShopifyConfigFetcher} from '../../types.js';
import {
  useRequestCacheData,
  useServerRequest,
} from '../ServerRequestProvider/index.js';
import {getOxygenVariable} from '../../utilities/storefrontApi.js';
import {SHOPIFY_STOREFRONT_ID_VARIABLE} from '../../constants.js';
import {getLocale} from '../../utilities/locale/index.js';

export const CLIENT_CONTEXT_ALLOW_LIST = [
  'defaultCountryCode',
  'defaultLanguageCode',
  'storeDomain',
  'storefrontToken',
  'storefrontApiVersion',
  'storefrontId',
] as const;

function makeShopifyContext(shopifyConfig: ShopifyConfig): {
  shopifyProviderServerValue: ShopifyContextServerValue;
  shopifyProviderClientValue: ShopifyContextClientValue;
} {
  const countryCode = shopifyConfig.defaultCountryCode ?? DEFAULT_COUNTRY;
  const languageCode = shopifyConfig.defaultLanguageCode ?? DEFAULT_LANGUAGE;
  const storefrontId =
    shopifyConfig.storefrontId ??
    getOxygenVariable(SHOPIFY_STOREFRONT_ID_VARIABLE);

  const shopifyProviderServerValue = {
    defaultCountryCode: countryCode.toUpperCase() as `${CountryCode}`,
    defaultLanguageCode: languageCode.toUpperCase() as `${LanguageCode}`,
    storeDomain: shopifyConfig?.storeDomain?.replace(/^https?:\/\//, ''),
    storefrontToken: shopifyConfig.storefrontToken,
    storefrontApiVersion: shopifyConfig.storefrontApiVersion,
    storefrontId,
    privateStorefrontToken: shopifyConfig.privateStorefrontToken,
  };

  return {
    shopifyProviderServerValue,
    shopifyProviderClientValue: CLIENT_CONTEXT_ALLOW_LIST.reduce(
      (clientConfigValue, key) => {
        clientConfigValue[key] = shopifyProviderServerValue[key];
        return clientConfigValue;
      },
      {} as ShopifyContextClientValue
    ),
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
   * [the `shopify` property in the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/configuration).
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

  const {shopifyProviderServerValue, shopifyProviderClientValue} = useMemo(
    () => makeShopifyContext(actualShopifyConfig),
    [actualShopifyConfig]
  );

  const localization = getLocalizationContextValue(
    shopifyProviderServerValue.defaultLanguageCode,
    shopifyProviderServerValue.defaultCountryCode,
    languageCode,
    countryCode
  );

  request.ctx.localization = localization;
  request.ctx.shopifyConfig = shopifyProviderServerValue;

  return (
    <ShopifyProviderClient
      shopifyConfig={shopifyProviderClientValue}
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
