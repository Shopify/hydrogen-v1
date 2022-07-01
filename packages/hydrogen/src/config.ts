import type {InlineHydrogenConfig} from './types.js';

export const defineConfig = (params: InlineHydrogenConfig) => params;

export type {InlineHydrogenConfig as HydrogenConfig};

export {ShopifyServerAnalyticsConnector} from './foundation/Analytics/connectors/Shopify/ServerAnalyticsConnector.js';
export {PerformanceMetricsServerAnalyticsConnector} from './foundation/Analytics/connectors/PerformanceMetrics/ServerAnalyticsConnector.js';

export {CookieSessionStorage} from './foundation/CookieSessionStorage/CookieSessionStorage.js';
export {MemorySessionStorage} from './foundation/MemorySessionStorage/MemorySessionStorage.js';
