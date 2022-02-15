import type {HydrogenVitePluginOptions, ShopifyConfig} from '../types';
import hydrogenConfig from './plugins/vite-plugin-hydrogen-config';
import type {Plugin} from 'vite';
import hydrogenMiddleware from './plugins/vite-plugin-hydrogen-middleware';
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
        return /(handle-worker-event|index|worker|server)\.js/.test(importer);
      },
    }),

    {
      name: 'hydrogen-hydration-auto-import',
      resolveId(id: string, importer: string) {
        if (
          id.includes('@shopify/hydrogen/entry-client') &&
          importer?.endsWith('/index.html')
        ) {
          return id + '?virtual';
        }
      },
      load(id) {
        if (id.includes('@shopify/hydrogen/entry-client?virtual')) {
          return `import renderHydrogen from '@shopify/hydrogen/entry-client';\n\nrenderHydrogen();`;
        }
      },
    },

    pluginOptions.purgeQueryCacheOnBuild && purgeQueryCache(),
  ] as Plugin[];
};
