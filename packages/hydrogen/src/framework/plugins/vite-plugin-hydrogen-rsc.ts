// @ts-ignore
import reactServerDomVite from '@shopify/hydrogen/vendor/react-server-dom-vite/plugin';
import {HYDROGEN_DEFAULT_SERVER_ENTRY} from './vite-plugin-hydrogen-middleware';

export default function () {
  return reactServerDomVite({
    serverBuildEntries: [
      HYDROGEN_DEFAULT_SERVER_ENTRY,
      'virtual:hydrogen-config:proxy',
    ],
    isServerComponentImporterAllowed(importer: string, source: string) {
      return (
        // Always allow the entry server (e.g. App.server.jsx) to be imported
        // in other files such as worker.js or server.js.
        source.includes(HYDROGEN_DEFAULT_SERVER_ENTRY) ||
        /(index|entry-server|hydrogen\.config)\.[jt]s/.test(importer) ||
        // Support importing server components for testing
        // TODO: revisit this when RSC splits into two bundles
        /\.test\.[tj]sx?$/.test(importer)
      );
    },
  });
}
