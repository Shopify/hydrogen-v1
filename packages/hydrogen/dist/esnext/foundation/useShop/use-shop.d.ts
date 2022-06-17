/**
 * The `useShop` hook provides access to values within
 * [the `shopify` property in the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config).
 * The `useShop` hook must be a descendent of a `ShopifyProvider` component.
 */
export declare function useShop(): import("../ShopifyProvider/types").ShopifyContextValue;
