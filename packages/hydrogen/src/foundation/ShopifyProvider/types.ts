import {ShopifyConfig} from '../../types';

export type ShopifyContextValue = {
  locale: string;
  storeDomain: ShopifyConfig['storeDomain'];
  storefrontToken: ShopifyConfig['storefrontToken'];
  storefrontApiVersion: string;
};
