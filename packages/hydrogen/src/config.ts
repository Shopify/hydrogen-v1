import type {InlineHydrogenConfig} from './types';

export const defineConfig = (params: InlineHydrogenConfig) => params;

export type {InlineHydrogenConfig as HydrogenConfig};

export {ShopifyServerAnalyticsConnector} from './foundation/Analytics/connectors/Shopify/ServerAnalyticsConnector';
export {PerformanceMetricsServerAnalyticsConnector} from './foundation/Analytics/connectors/PerformanceMetrics/ServerAnalyticsConnector';

export {CookieSessionStorage} from './foundation/CookieSessionStorage/CookieSessionStorage';
export {MemorySessionStorage} from './foundation/MemorySessionStorage/MemorySessionStorage';
