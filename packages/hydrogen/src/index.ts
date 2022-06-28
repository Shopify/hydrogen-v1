/**
 * Export all client components from here to ensure they're available in both import
 * paths. This is because we transform `@shopify/hydrogen` to `@shopify/hydrogen/client`
 * inside client components during the client build only, but when the same components
 * run during SSR, they reference this path.
 */
export * from './client';

/**
 * The following are exported from this file because they are intended to be available
 * *only* on the server.
 */
export {
  ServerPropsProvider,
  ServerPropsContext,
  type ServerProps,
  type ServerPropsContextValue,
} from './foundation/ServerPropsProvider';
export {useShop} from './foundation/useShop';
export {useUrl} from './foundation/useUrl';
export {
  useShopQuery,
  type UseShopQueryResponse,
} from './hooks/useShopQuery/hooks';
export {
  useQuery,
  type HydrogenUseQueryOptions,
} from './foundation/useQuery/hooks';
export {useServerProps} from './foundation/useServerProps';
export {FileRoutes} from './foundation/FileRoutes/FileRoutes.server';
export {Route} from './foundation/Route/Route.server';
export {Router} from './foundation/Router/Router.server';
export {log, type Logger} from './utilities/log';
export {LocalizationProvider} from './components/LocalizationProvider/LocalizationProvider.server';
export {ShopifyProvider} from './foundation/ShopifyProvider/ShopifyProvider.server';
export {renderRscFromApiRoute as renderRsc} from './utilities/apiRoutes';
export {
  generateCacheControlHeader,
  CacheNone,
  CacheShort,
  CacheLong,
  CacheCustom,
} from './foundation/Cache/strategies';
export {useRequestContext} from './foundation/useRequestContext';
export {useServerAnalytics} from './foundation/Analytics/hook';
export {ShopifyAnalytics} from './foundation/Analytics/connectors/Shopify/ShopifyAnalytics.server';
export {ShopifyAnalyticsConstants} from './foundation/Analytics/connectors/Shopify/const';
export {useSession} from './foundation/useSession/useSession';
export {Cookie} from './foundation/Cookie/Cookie';

/**
 * Export server-only CartQuery here instead of `CartProvider.client` to prevent
 * it from being bundled with other client components
 */
export {CartQuery} from './components/CartProvider/cart-queries';

/**
 * Override the client version of `fetchSync` with the server version.
 */
export {fetchSync} from './foundation/fetchSync/server/fetchSync';

export {type HydrogenRequest} from './foundation/HydrogenRequest/HydrogenRequest.server';
export {type HydrogenResponse} from './foundation/HydrogenResponse/HydrogenResponse.server';
export {type HydrogenRouteProps} from './types';
export {
  type ResourceGetter as HydrogenApiRoute,
  RequestOptions as HydrogenApiRouteOptions,
} from './utilities/apiRoutes';
