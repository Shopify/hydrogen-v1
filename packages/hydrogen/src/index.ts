/**
 * Export all client components from here to ensure they're available in both import
 * paths. This is because we transform `@shopify/hydrogen` to `@shopify/hydrogen/client`
 * inside client components during the client build only, but when the same components
 * run during SSR, they reference this path.
 */
export * from './client.js';

/**
 * The following are exported from this file because they are intended to be available
 * *only* on the server.
 */
export {
  ServerPropsProvider,
  ServerPropsContext,
  type ServerProps,
  type ServerPropsContextValue,
} from './foundation/ServerPropsProvider/index.js';
export {useShop} from './foundation/useShop/index.js';
export {useUrl} from './foundation/useUrl/index.js';
export {
  useShopQuery,
  type UseShopQueryResponse,
} from './hooks/useShopQuery/index.js';
export {
  useQuery,
  type HydrogenUseQueryOptions,
} from './foundation/useQuery/hooks.js';
export {useServerProps} from './foundation/useServerProps/index.js';
export {FileRoutes} from './foundation/FileRoutes/FileRoutes.server.js';
export {Route} from './foundation/Route/Route.server.js';
export {Router} from './foundation/Router/Router.server.js';
export {log, type Logger} from './utilities/log/index.js';
export {LocalizationProvider} from './components/LocalizationProvider/LocalizationProvider.server.js';
export {ShopifyProvider} from './foundation/ShopifyProvider/ShopifyProvider.server.js';
export {
  generateCacheControlHeader,
  CacheNone,
  CacheShort,
  CacheLong,
  CacheCustom,
} from './foundation/Cache/strategies/index.js';
export {useRequestContext} from './foundation/useRequestContext/index.js';
export {useServerAnalytics} from './foundation/Analytics/hook.js';
export {ShopifyAnalytics} from './foundation/Analytics/connectors/Shopify/ShopifyAnalytics.server.js';
export {ShopifyAnalyticsConstants} from './foundation/Analytics/connectors/Shopify/const.js';
export {useSession} from './foundation/useSession/useSession.js';
export {Cookie} from './foundation/Cookie/Cookie.js';
export {useDelay} from './hooks/useDelay/useDelay.js';

/**
 * Export server-only CartQuery here instead of `CartProvider.client` to prevent
 * it from being bundled with other client components
 */
export {CartQuery} from './components/CartProvider/cart-queries.js';

/**
 * Override the client version of `fetchSync` with the server version.
 */
export {fetchSync} from './foundation/fetchSync/server/fetchSync.js';

export {type HydrogenRequest} from './foundation/HydrogenRequest/HydrogenRequest.server.js';
export {type HydrogenResponse} from './foundation/HydrogenResponse/HydrogenResponse.server.js';
export {type HydrogenRouteProps, type CachingStrategy} from './types.js';
export {
  type ResourceGetter as HydrogenApiRoute,
  RequestOptions as HydrogenApiRouteOptions,
} from './utilities/apiRoutes.js';

export {getOnlineStorefrontHeaders} from './utilities/storefrontApi.js';
