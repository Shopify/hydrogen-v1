import type {CountryCode, LanguageCode} from '../../storefront-api-types.js';
import type {ReactNode} from 'react';
import type {ShopifyConfigFetcher, ShopifyConfig} from '../../types.js';
import type {CLIENT_CONTEXT_ALLOW_LIST} from './ShopifyProvider.server.js';

export interface ShopifyContextServerValue
  extends Omit<ShopifyConfig, 'defaultLanguageCode' | 'defaultCountryCode'> {
  defaultLanguageCode: `${LanguageCode}`;
  defaultCountryCode: `${CountryCode}`;
}

type CLIENT_KEYS = typeof CLIENT_CONTEXT_ALLOW_LIST[number];

export type ShopifyContextClientValue = Pick<
  ShopifyContextServerValue,
  CLIENT_KEYS
>;

// TODO: improve types with intrinsic string manipulation
export type Locale = string;

export interface LocalizationContextValue {
  country: {
    isoCode: `${CountryCode}`;
  };
  language: {
    isoCode: `${LanguageCode}`;
  };
  locale: Locale;
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
