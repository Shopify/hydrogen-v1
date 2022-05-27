// @ts-ignore
import reactServerDomVite from '@shopify/hydrogen/vendor/react-server-dom-vite/plugin';
import {
  HYDROGEN_DEFAULT_SERVER_ENTRY,
  VIRTUAL_PROXY_HYDROGEN_ROUTES_ID,
} from './vite-plugin-hydrogen-middleware';
import {viteception} from '../viteception';

export default function () {
  return reactServerDomVite({
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
    async findClientComponentsForClientBuild() {
      const {server} = await viteception([
        // Load server entry to discover client components early
        HYDROGEN_DEFAULT_SERVER_ENTRY,
        // Route globs are placed in a virtual module and need to
        // be loaded to discover client components in routes
        VIRTUAL_PROXY_HYDROGEN_ROUTES_ID,
      ]);

      // At this point, the server has loaded all the components in the module graph
      return reactServerDomVite.findClientComponentsFromServer(server);
    },
  });
}
