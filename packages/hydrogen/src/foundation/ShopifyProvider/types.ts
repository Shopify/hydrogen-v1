import type {CountryCode, LanguageCode} from '../../storefront-api-types';
import type {ReactNode} from 'react';
import type {ShopifyConfigFetcher, ShopifyConfig} from '../../types';

export type ShopifyContextValue = {
  locale: `${LanguageCode}-${CountryCode}`;
  languageCode: `${LanguageCode}`;
  storeDomain: ShopifyConfig['storeDomain'];
  storefrontToken: ShopifyConfig['storefrontToken'];
  storefrontApiVersion: string;
};

export type ShopifyProviderProps = {
  /** Shopify connection information. Defaults to the `shopify` property in the `hydrogen.config.js` file. */
  shopifyConfig?: ShopifyConfig | ShopifyConfigFetcher;
  /** Any `ReactNode` elements. */
  children?: ReactNode;
};
