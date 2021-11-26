import React, {ReactElement} from 'react';
import {ShopifyConfig} from '../../types';
import {ShopifyProvider} from './ShopifyProvider';

export function ShopifyServerProvider({
  children,
  shopifyConfig,
}: {
  children: ReactElement;
  shopifyConfig: ShopifyConfig;
}) {
  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>{children}</ShopifyProvider>
  );
}
