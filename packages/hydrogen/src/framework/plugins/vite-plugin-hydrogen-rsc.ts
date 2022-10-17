// @ts-ignore
import reactServerDomVite from '@shopify/hydrogen/vendor/react-server-dom-vite/plugin.js';
import {HydrogenVitePluginOptions} from '../types.js';
import {HYDROGEN_DEFAULT_SERVER_ENTRY} from './vite-plugin-hydrogen-middleware.js';
import {VIRTUAL_PROXY_HYDROGEN_ROUTES_ID} from './vite-plugin-hydrogen-virtual-files.js';

export default function (options?: HydrogenVitePluginOptions) {
  return reactServerDomVite({
    serverBuildEntries: [
      HYDROGEN_DEFAULT_SERVER_ENTRY,
      VIRTUAL_PROXY_HYDROGEN_ROUTES_ID,
    ],
    isServerComponentImporterAllowed(importer: string, source: string) {
      return (
        // Always allow the entry server (e.g. App.server.jsx) to be imported
        // in other files such as worker.js or server.js.
        source.includes(HYDROGEN_DEFAULT_SERVER_ENTRY) ||
        /(index|provider-helpers|entry-server|testing|hydrogen\.config)\.[jt]s/.test(
          importer
        ) ||
        // Support importing server components for testing
        // TODO: revisit this when RSC splits into two bundles
        /\.(test|vitest|spec)\.[tj]sx?$/.test(importer)
      );
    },
    ...options,
  });
}
