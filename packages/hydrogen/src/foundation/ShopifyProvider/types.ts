import type {CountryCode, LanguageCode} from '../../storefront-api-types';
import type {ReactNode} from 'react';
import type {ShopifyConfigFetcher, ShopifyConfig} from '../../types';

export interface ShopifyContextValue
  extends Omit<ShopifyConfig, 'defaultLanguageCode' | 'defaultCountryCode'> {
  defaultLanguageCode: `${LanguageCode}`;
  defaultCountryCode: `${CountryCode}`;
  storefrontId: string | null;
}

export type ShopifyProviderProps = {
  /** Shopify connection information. Defaults to the `shopify` property in the `hydrogen.config.js` file. */
  shopifyConfig?: ShopifyConfig | ShopifyConfigFetcher;
  /** Any `ReactNode` elements. */
  children?: ReactNode;
};
