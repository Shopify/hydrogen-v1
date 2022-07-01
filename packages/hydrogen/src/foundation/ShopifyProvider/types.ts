import type {CountryCode, LanguageCode} from '../../storefront-api-types.js';
import type {ReactNode} from 'react';
import type {ShopifyConfigFetcher, ShopifyConfig} from '../../types.js';

export interface ShopifyContextValue
  extends Omit<ShopifyConfig, 'defaultLanguageCode' | 'defaultCountryCode'> {
  defaultLanguageCode: `${LanguageCode}`;
  defaultCountryCode: `${CountryCode}`;
  storefrontId: string | null;
}

export interface LocalizationContextValue {
  country: {
    isoCode: `${CountryCode}`;
  };
  language: {
    isoCode: `${LanguageCode}`;
  };
  locale: `${LanguageCode}-${CountryCode}`;
}

export type ShopifyProviderProps = {
  /** Shopify connection information. Defaults to the `shopify` property in the `hydrogen.config.js` file. */
  shopifyConfig?: ShopifyConfig | ShopifyConfigFetcher;
  /** Any `ReactNode` elements. */
  children?: ReactNode;
  /**
   * Override the `isoCode` to define the active country
   */
  countryCode?: `${CountryCode}`;

  /**
   * Override the `languageCode` to define the active language
   */
  languageCode?: `${LanguageCode}`;
};
