export * from './foundation/';
export * from './components/';
export * from './hooks/';

export {
  flattenConnection,
  fetchBuilder,
  graphqlRequestBody,
  decodeShopifyId,
  isClient,
  getTime,
} from './utilities';
export {gql} from './utilities/graphql-tag';

export {FileRoutes} from './foundation/FileRoutes/FileRoutes.server';
export {Route} from './foundation/Route/Route.server';
export {Router} from './foundation/Router/Router.server';
export {log, setLogger, setLoggerOptions, Logger} from './utilities/log';
export {useRouteParams} from './foundation/useRouteParams/useRouteParams';

// This is exported here because it contains a Server Component
export {LocalizationProvider} from './components/LocalizationProvider/LocalizationProvider.server';
export {ShopifyProvider} from './foundation/ShopifyProvider/ShopifyProvider.server';

// Exported here because users shouldn't be making `useShopQuery` calls from the client
export * from './hooks/useShopQuery/hooks';
export * from './foundation/useQuery/hooks';
export * from './foundation/useServerProps';
export {Head} from './foundation/Head';

// Export server-only CartQuery here instead of `CartProvider.client` to prevent
// it from being bundled with other client components
export {CartQuery} from './components/CartProvider/cart-queries';

export {
  generateCacheControlHeader,
  NoStore,
  CacheSeconds,
  CacheMinutes,
  CacheHours,
  CacheDays,
  CacheWeeks,
  CacheMonths,
  CacheCustom,
} from './framework/CachingStrategy';

export {fetchSync} from './foundation/fetchSync/server/fetchSync';

export {useServerAnalytics} from './foundation/Analytics/hook';
export * as ShopifyServerAnalyticsConnector from './foundation/Analytics/connectors/Shopify/ServerAnalyticsConnector.server';
export {ShopifyAnalytics} from './foundation/Analytics/connectors/Shopify/ShopifyAnalytics.server';
export {ShopifyAnalyticsConstants} from './foundation/Analytics/connectors/Shopify/const';
export * as PerformanceMetricsServerAnalyticsConnector from './foundation/Analytics/connectors/PerformanceMetrics/ServerAnalyticsConnector.server';
export {PerformanceMetrics} from './foundation/Analytics/connectors/PerformanceMetrics/PerformanceMetrics.client';
export {PerformanceMetricsDebug} from './foundation/Analytics/connectors/PerformanceMetrics/PerformanceMetricsDebug.client';

export {useSession} from './foundation/useSession/useSession';
export {CookieSessionStorage} from './foundation/CookieSessionStorage/CookieSessionStorage';
export {MemorySessionStorage} from './foundation/MemorySessionStorage/MemorySessionStorage';
export {Cookie} from './foundation/Cookie/Cookie';
