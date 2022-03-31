import type {HydrogenVitePluginOptions, ShopifyConfig} from '../types';
import hydrogenConfigPlugin from './plugins/vite-plugin-hydrogen-config';
import type {Plugin} from 'vite';
import hydrogenMiddleware, {
  HYDROGEN_DEFAULT_LEGACY_ENTRY,
  HYDROGEN_DEFAULT_SERVER_ENTRY,
} from './plugins/vite-plugin-hydrogen-middleware';
import hydrogenClientMiddleware from './plugins/vite-plugin-hydrogen-client-middleware';
import platformEntry from './plugins/vite-plugin-platform-entry';
// @ts-ignore
import rsc from '@shopify/hydrogen/vendor/react-server-dom-vite/plugin';
import ssrInterop from './plugins/vite-plugin-ssr-interop';
import purgeQueryCache from './plugins/vite-plugin-purge-query-cache';
import hydrationAutoImport from './plugins/vite-plugin-hydration-auto-import';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react';
import path from 'path';
import cssModulesRsc from './plugins/vite-plugin-css-modules-rsc';
import entryServerAutoImport from './plugins/vite-plugin-entry-server-auto-import';

export default (
  hydrogenConfig: any,
  shopifyConfig: ShopifyConfig,
  pluginOptions: HydrogenVitePluginOptions = {}
) => {
  return [
    process.env.VITE_INSPECT && inspect(),

    hydrogenConfigPlugin(),
    hydrogenClientMiddleware(),
    hydrogenMiddleware(shopifyConfig, pluginOptions),
    react(),
    entryServerAutoImport(hydrogenConfig),
    hydrationAutoImport(hydrogenConfig),
    ssrInterop(),
    cssModulesRsc(),
    rsc({
      clientComponentPaths: [
        path.join(
          path.dirname(require.resolve('@shopify/hydrogen/package.json'))
        ),
      ],
      isServerComponentImporterAllowed(importer: string, source: string) {
        // Always allow the entry server (e.g. App.server.jsx) to be imported
        // in other files such as worker.js or server.js.
        const entryServer =
          process.env.HYDROGEN_SERVER_ENTRY ||
          HYDROGEN_DEFAULT_SERVER_ENTRY ||
          HYDROGEN_DEFAULT_LEGACY_ENTRY;

        return (
          source.includes(entryServer) ||
          // TODO update this after handleEvent is replaced with handleRequest
          /(handle-worker-event|index|entry-server)\.js/.test(importer) ||
          // Support importing server components for testing
          // TODO: revisit this when RSC splits into two bundles
          /\.test\.[tj]sx?$/.test(importer)
        );
      },
    }),
    platformEntry(),
    pluginOptions.purgeQueryCacheOnBuild && purgeQueryCache(),
  ] as Plugin[];
};
