import React, { useMemo } from 'react';
import { ShopifyProviderClient } from './ShopifyProvider.client';
import { DEFAULT_LOCALE } from '../constants';
import { useRequestCacheData, useServerRequest } from '../ServerRequestProvider';
function makeShopifyContext(shopifyConfig) {
    const locale = shopifyConfig.defaultLocale ?? DEFAULT_LOCALE;
    const languageCode = locale.split(/[-_]/)[0];
    return {
        locale: locale.toUpperCase(),
        languageCode: languageCode.toUpperCase(),
        storeDomain: shopifyConfig?.storeDomain?.replace(/^https?:\/\//, ''),
        storefrontToken: shopifyConfig.storefrontToken,
        storefrontApiVersion: shopifyConfig.storefrontApiVersion,
        multipassSecret: shopifyConfig.multipassSecret,
    };
}
export const SHOPIFY_PROVIDER_CONTEXT_KEY = Symbol.for('SHOPIFY_PROVIDER_RSC');
/**
 * The `ShopifyProvider` component wraps your entire app and provides support for hooks.
 * You should place it in your app's entry point component. For example, `<App>`.
 * If you're using the Hydrogen framework, you don't need to add this provider
 * because it's automatically wrapped around your app in `renderHydrogen()`.
 */
export function ShopifyProvider({ 
/**
 * Shopify connection information. Defaults to
 * [the `shopify` property in the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config).
 */
shopifyConfig, 
/** Any `ReactNode` elements. */
children, }) {
    const request = useServerRequest();
    if (!shopifyConfig) {
        shopifyConfig = request.ctx.hydrogenConfig?.shopify;
        if (!shopifyConfig) {
            throw new Error('The `shopifyConfig` prop should be passed to `ShopifyProvider`');
        }
    }
    let actualShopifyConfig;
    if (typeof shopifyConfig === 'function') {
        const result = useRequestCacheData(['hydrogen-shopify-config'], () => shopifyConfig(request));
        if (result.error) {
            if (result.error instanceof Error) {
                throw result.error;
            }
            throw new Error(`Failed to load Shopify config: ${result.error.statusText}`);
        }
        actualShopifyConfig = result.data;
    }
    else {
        actualShopifyConfig = shopifyConfig;
    }
    const shopifyProviderValue = useMemo(() => makeShopifyContext(actualShopifyConfig), [actualShopifyConfig]);
    request.ctx.shopifyConfig = shopifyProviderValue;
    return (React.createElement(ShopifyProviderClient, { shopifyConfig: shopifyProviderValue }, children));
}
