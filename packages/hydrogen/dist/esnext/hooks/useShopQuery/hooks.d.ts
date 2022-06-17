import type { CachingStrategy, PreloadOptions } from '../../types';
export interface UseShopQueryResponse<T> {
    /** The data returned by the query. */
    data: T;
    errors: any;
}
/**
 * The `useShopQuery` hook allows you to make server-only GraphQL queries to the Storefront API. It must be a descendent of a `ShopifyProvider` component.
 */
export declare function useShopQuery<T>({ query, variables, cache, preload, }: {
    /** A string of the GraphQL query.
     * If no query is provided, useShopQuery will make no calls to the Storefront API.
     */
    query?: string;
    /** An object of the variables for the GraphQL query. */
    variables?: Record<string, any>;
    /** The [caching strategy](https://shopify.dev/custom-storefronts/hydrogen/framework/cache#caching-strategies) to
     * help you determine which cache control header to set.
     */
    cache?: CachingStrategy;
    /** A string corresponding to a valid locale identifier like `en-us` used to make the request. */
    locale?: string;
    /** Whether to[preload the query](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries).
     * Defaults to `false`. Specify `true` to preload the query for the URL or `'*'`
     * to preload the query for all requests.
     */
    preload?: PreloadOptions;
}): UseShopQueryResponse<T>;
