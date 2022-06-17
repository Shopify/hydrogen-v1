import React, { createContext } from 'react';
export const ShopifyContext = createContext(null);
export function ShopifyProviderClient({ children, shopifyConfig, }) {
    if (!shopifyConfig) {
        throw new Error('The `shopifyConfig` prop should be passed to `ShopifyProvider`');
    }
    return (React.createElement(ShopifyContext.Provider, { value: shopifyConfig }, children));
}
