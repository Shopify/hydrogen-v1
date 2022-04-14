// @ts-ignore
import reactServerDomVite from '@shopify/hydrogen/vendor/react-server-dom-vite/plugin';
import {HYDROGEN_DEFAULT_SERVER_ENTRY} from './vite-plugin-hydrogen-middleware';
import {createServer} from 'vite';

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
      // In client build, we create a local server to discover client compoents.
      const server = await createServer({server: {middlewareMode: 'ssr'}});

      await Promise.all([
        // Load server entry to discover client components early
        server.ssrLoadModule(HYDROGEN_DEFAULT_SERVER_ENTRY),
        // Route globs are placed in hydrogen.config.js and need to
        // be loaded to discover client components in routes
        server.ssrLoadModule('virtual:hydrogen-config:proxy'),
      ]);

      await server.close();

      // At this point, the server has loaded all the components in the module graph
      return Array.from(server.moduleGraph.fileToModulesMap.keys()).filter(
        (item) => /\.client\.[jt]sx?$/.test(item)
      );
    },
  });
}
