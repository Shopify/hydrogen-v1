import type { ShopifyContextValue } from './types';
import React, { ReactNode } from 'react';
export declare const ShopifyContext: React.Context<ShopifyContextValue | null>;
export declare function ShopifyProviderClient({ children, shopifyConfig, }: {
    children: ReactNode;
    shopifyConfig: ShopifyContextValue;
}): JSX.Element;
