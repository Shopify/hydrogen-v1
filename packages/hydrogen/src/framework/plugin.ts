import type {HydrogenVitePluginOptions, ShopifyConfig} from '../types';
import hydrogenConfig from './plugins/vite-plugin-hydrogen-config';
import type {Plugin} from 'vite';
import hydrogenMiddleware from './plugins/vite-plugin-hydrogen-middleware';
import hydrogenClientMiddleware from './plugins/vite-plugin-hydrogen-client-middleware';
// @ts-ignore
import rsc from '@shopify/hydrogen/vendor/react-server-dom-vite/plugin';
import ssrInterop from './plugins/vite-plugin-ssr-interop';
import purgeQueryCache from './plugins/vite-plugin-purge-query-cache';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react';
import path from 'path';

export default (
  shopifyConfig: ShopifyConfig,
  pluginOptions: HydrogenVitePluginOptions = {}
) => {
  return [
    process.env.VITE_INSPECT && inspect(),

    hydrogenConfig(),
    hydrogenClientMiddleware(),
    hydrogenMiddleware(shopifyConfig, pluginOptions),
    react(),
    ssrInterop(),
    rsc({
      clientComponentPaths: [
        path.join(
          path.dirname(require.resolve('@shopify/hydrogen/package.json'))
        ),
      ],
      isServerComponentImporterAllowed(importer: string) {
        return /(handle-worker-event|index)\.js/.test(importer);
      },
    }),

    pluginOptions.purgeQueryCacheOnBuild && purgeQueryCache(),
  ] as Plugin[];
};
