import type {HydrogenVitePluginOptions} from '../types';
import hydrogenConfig from './plugins/vite-plugin-hydrogen-config';
import type {Plugin} from 'vite';
import hydrogenMiddleware, {
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

export default (pluginOptions: HydrogenVitePluginOptions = {}) => {
  let hydrogenUiPath;

  try {
    hydrogenUiPath = path.join(
      // eslint-disable-next-line node/no-missing-require
      path.dirname(require.resolve('@shopify/hydrogen-ui/client'))
    );
  } catch (error) {
    // hydrogen-ui isn't installed, so don't worry about it
  }

  return [
    process.env.VITE_INSPECT && inspect(),

    hydrogenConfig(),
    hydrogenClientMiddleware(),
    hydrogenMiddleware(pluginOptions),
    react(),
    hydrationAutoImport(),
    ssrInterop(),
    cssModulesRsc(),
    rsc({
      clientComponentPaths: [
        path.join(
          path.dirname(require.resolve('@shopify/hydrogen/package.json'))
        ),
        ...[hydrogenUiPath].filter(Boolean),
      ],
      isServerComponentImporterAllowed(importer: string, source: string) {
        return (
          // Always allow the entry server (e.g. App.server.jsx) to be imported
          // in other files such as worker.js or server.js.
          source.includes(HYDROGEN_DEFAULT_SERVER_ENTRY) ||
          // TODO update this after handleEvent is replaced with handleRequest
          /(index|entry-server|hydrogen\.config)\.[jt]s/.test(importer) ||
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
