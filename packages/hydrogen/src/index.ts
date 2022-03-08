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

export {FileRoutes} from './foundation/Router/FileRoutes.server';
export {Route} from './foundation/Router/Route.server';
export {Router} from './foundation/Router/Router.server';
export {log, setLogger, setLoggerOptions, Logger} from './utilities/log';
export {useParams} from './foundation/Router/useParams';

// This is exported here because it contains a Server Component
export {LocalizationProvider} from './components/LocalizationProvider/LocalizationProvider.server';
export {ShopifyProvider} from './foundation/ShopifyProvider/ShopifyProvider.server';

// Exported here because users shouldn't be making `useShopQuery` calls from the client
export * from './hooks/useShopQuery';

// Export server-only CartQuery here instead of `CartProvider.client` to prevent
// it from being bundled with other client components
export {CartQuery} from './graphql/graphql-constants';

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
