import React, {ReactElement} from 'react';
import {ShopifyConfig} from '../../types';
import {ShopifyProvider} from './ShopifyProvider';
import {QueryProvider} from '../../hooks/useQuery';
import {ReactQueryHydrationContext} from './types';

export function ShopifyServerProvider({
  children,
  shopifyConfig,
  hydrationContext,
}: {
  children: ReactElement;
  shopifyConfig: ShopifyConfig;
  hydrationContext: ReactQueryHydrationContext;
}) {
  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>
      <QueryProvider hydrationContext={hydrationContext}>
        {children}
      </QueryProvider>
    </ShopifyProvider>
  );
}
