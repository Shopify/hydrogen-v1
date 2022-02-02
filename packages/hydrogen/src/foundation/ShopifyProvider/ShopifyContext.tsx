import {createContext} from 'react';
import {DEFAULT_LOCALE} from '../constants';
import type {ShopifyContextValue} from './types';
import type {ShopifyConfig} from '../../types';

export const ShopifyContext = createContext<ShopifyContextValue | null>(null);

/* this can be move into ShopifyProvider once ShopifyContext can be use in RSC again */
export function makeShopifyContext(
  shopifyConfig: ShopifyConfig
): ShopifyContextValue {
  return {
    locale: shopifyConfig.defaultLocale ?? DEFAULT_LOCALE,
    storeDomain: shopifyConfig?.storeDomain?.replace(/^https?:\/\//, ''),
    storefrontToken: shopifyConfig.storefrontToken,
    storefrontApiVersion: shopifyConfig.storefrontApiVersion,
  };
}
