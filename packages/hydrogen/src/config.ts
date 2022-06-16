import type {InlineHydrogenConfig} from './types';

export const defineConfig = (params: InlineHydrogenConfig) => params;

export type {InlineHydrogenConfig as HydrogenConfig};

export {ShopifyServerAnalyticsConnector} from './foundation/Analytics/connectors/Shopify/ServerAnalyticsConnector';
export {PerformanceMetricsServerAnalyticsConnector} from './foundation/Analytics/connectors/PerformanceMetrics/ServerAnalyticsConnector';

export {CookieSessionStorage} from './foundation/CookieSessionStorage/CookieSessionStorage';
export {MemorySessionStorage} from './foundation/MemorySessionStorage/MemorySessionStorage';

import {createServer} from 'vite';
import hydrogenVirtualFiles from './framework/plugins/vite-plugin-hydrogen-virtual-files';

export async function loadConfig(root?: string) {
  const server = await createServer({
    root,
    clearScreen: false,
    server: {middlewareMode: 'ssr'},
    plugins: [hydrogenVirtualFiles({})],
  });

  const loaded = await server.ssrLoadModule(
    'virtual__proxy__hydrogen.config.ts'
  );

  await server.close();

  return loaded.default;
}
