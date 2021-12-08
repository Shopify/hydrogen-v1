import {ShopifyConfig} from '../../types';

export type ShopifyProviderValue = ShopifyConfig;

export type ShopifyProviderProps = {
  /** The contents of the `shopify.config.js` file. */
  shopifyConfig: ShopifyConfig;
  /** Any `ReactNode` elements. */
  children?: React.ReactNode;
  manager?: any;
};
