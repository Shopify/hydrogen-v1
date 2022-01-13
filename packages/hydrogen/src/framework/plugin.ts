import type {HydrogenVitePluginOptions, ShopifyConfig} from '../types';
import hydrogenConfig from './plugins/vite-plugin-hydrogen-config';
import hydrogenMiddleware from './plugins/vite-plugin-hydrogen-middleware';
import reactServerComponentShim from './plugins/vite-plugin-react-server-components-shim';
import purgeQueryCache from './plugins/vite-plugin-purge-query-cache';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react';

export default (
  shopifyConfig: ShopifyConfig,
  pluginOptions: HydrogenVitePluginOptions = {}
) => {
  return [
    process.env.VITE_INSPECT && inspect(),

    hydrogenConfig(),
    hydrogenMiddleware(shopifyConfig, pluginOptions),
    reactServerComponentShim(),
    react(),

    pluginOptions.purgeQueryCacheOnBuild ? purgeQueryCache() : null,
  ];
};
