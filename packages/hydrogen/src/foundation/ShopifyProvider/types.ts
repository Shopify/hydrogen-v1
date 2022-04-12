import type {CountryCode, LanguageCode} from '../../storefront-api-types';
import type {ReactNode} from 'react';
import type {HydrogenConfig, ShopifyConfig} from '../../types';

export type ShopifyContextValue = {
  locale: `${LanguageCode}-${CountryCode}`;
  languageCode: `${LanguageCode}`;
  storeDomain: ShopifyConfig['storeDomain'];
  storefrontToken: ShopifyConfig['storefrontToken'];
  storefrontApiVersion: string;
};

export type ShopifyProviderProps = {
  /** The contents of the `hydrogen.config.js` file. */
  shopifyConfig?: HydrogenConfig['shopify'];
  /** Any `ReactNode` elements. */
  children?: ReactNode;
  /** PLACEHOLDER DESCRIPTION */
  manager?: any;
};
