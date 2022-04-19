import type {CountryCode, LanguageCode} from '../../storefront-api-types';
import type {ReactNode} from 'react';
import type {ShopifyConfig} from '../../types';

export interface ShopifyContextValue
  extends Omit<ShopifyConfig, 'defaultLocale'> {
  locale: `${LanguageCode}-${CountryCode}`;
  languageCode: `${LanguageCode}`;
}

export type ShopifyProviderProps = {
  /** The contents of the `shopify.config.js` file. */
  shopifyConfig: ShopifyConfig;
  /** Any `ReactNode` elements. */
  children?: ReactNode;
  manager?: any;
};
