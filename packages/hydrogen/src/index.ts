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

export {ShopifyProvider} from './foundation/ShopifyProvider';
export {log, setLogger, Logger} from './utilities/log';

export {Helmet} from 'react-helmet-async';

// This is exported here because it contains a Server Component
export {LocalizationProvider} from './components/LocalizationProvider/LocalizationProvider.server';

// Exported here because users shouldn't be making `useShopQuery` calls from the client
export * from './hooks/useShopQuery';

// Export server-only CartQuery here instead of `CartProvider.client` to prevent
// it from being bundled with other client components
export {CartQuery} from './graphql/graphql-constants';
