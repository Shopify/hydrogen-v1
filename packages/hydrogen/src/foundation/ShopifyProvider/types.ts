import type {ReactNode} from 'react';
import type {ShopifyConfig} from '../../types';

export type ShopifyContextValue = {
  locale: string;
  storeDomain: ShopifyConfig['storeDomain'];
  storefrontToken: ShopifyConfig['storefrontToken'];
  storefrontApiVersion: string;
};

export type ShopifyProviderProps = {
  /** The contents of the `shopify.config.js` file. */
  shopifyConfig: ShopifyConfig;
  /** Any `ReactNode` elements. */
  children?: ReactNode;
  manager?: any;
};
