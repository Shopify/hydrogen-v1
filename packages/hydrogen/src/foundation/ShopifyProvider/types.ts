import {ShopifyConfig} from '../../types';

export type ShopifyContextValue = {
  locale: string;
  storeDomain: ShopifyConfig['storeDomain'];
  storefrontToken: ShopifyConfig['storefrontToken'];
  graphqlApiVersion: string;
};

export type ShopifyProviderProps = {
  /** The contents of the `shopify.config.js` file. */
  shopifyConfig: ShopifyConfig;
  /** Any `ReactNode` elements. */
  children?: React.ReactNode;
  manager?: any;
};
