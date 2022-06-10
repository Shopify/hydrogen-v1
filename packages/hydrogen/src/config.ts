import type {InlineHydrogenConfig} from './types';

export const defineConfig = (params: InlineHydrogenConfig) => params;

export type {InlineHydrogenConfig as HydrogenConfig};

export * as ShopifyServerAnalyticsConnector from './foundation/Analytics/connectors/Shopify/ServerAnalyticsConnector.server';
export * as PerformanceMetricsServerAnalyticsConnector from './foundation/Analytics/connectors/PerformanceMetrics/ServerAnalyticsConnector.server';

export {CookieSessionStorage} from './foundation/CookieSessionStorage/CookieSessionStorage';
export {MemorySessionStorage} from './foundation/MemorySessionStorage/MemorySessionStorage';
