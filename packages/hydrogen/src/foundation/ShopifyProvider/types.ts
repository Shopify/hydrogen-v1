import type {QueryClient} from 'react-query';
import {ShopifyConfig} from '../../types';

export type ShopifyProviderValue = ShopifyConfig;

export type ShopifyProviderProps = {
  /** The contents of the `shopify.config.js` file. */
  shopifyConfig: ShopifyConfig;
  /** Any `ReactNode` elements. */
  children?: React.ReactNode;
  manager?: any;
};

export interface ReactQueryHydrationContext {
  queryClient?: QueryClient;
  dehydratedState?: any;
}
