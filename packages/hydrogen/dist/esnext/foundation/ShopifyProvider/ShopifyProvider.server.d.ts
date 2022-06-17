import type { ShopifyProviderProps } from './types';
export declare const SHOPIFY_PROVIDER_CONTEXT_KEY: unique symbol;
/**
 * The `ShopifyProvider` component wraps your entire app and provides support for hooks.
 * You should place it in your app's entry point component. For example, `<App>`.
 * If you're using the Hydrogen framework, you don't need to add this provider
 * because it's automatically wrapped around your app in `renderHydrogen()`.
 */
export declare function ShopifyProvider({ 
/**
 * Shopify connection information. Defaults to
 * [the `shopify` property in the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config).
 */
shopifyConfig, 
/** Any `ReactNode` elements. */
children, }: ShopifyProviderProps): JSX.Element;
