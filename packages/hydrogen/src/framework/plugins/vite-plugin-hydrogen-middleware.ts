import {Plugin, loadEnv} from 'vite';
import path from 'path';
import {promises as fs} from 'fs';
import {hydrogenMiddleware, graphiqlMiddleware} from '../middleware';
import type {HydrogenVitePluginOptions, ShopifyConfig} from '../../types';
import {InMemoryCache} from '../cache/in-memory';
import {envPrefix} from './vite-plugin-hydrogen-config';

declare global {
  // eslint-disable-next-line no-var
  var Oxygen: {env: Record<string, string | undefined>; [key: string]: any};
}

export default (
  shopifyConfig: ShopifyConfig,
  pluginOptions: HydrogenVitePluginOptions
) => {
  return {
    name: 'vite-plugin-hydrogen-middleware',

    /**
     * By adding a middleware to the Vite dev server, we can handle SSR without needing
     * a custom node script. It works by handling any requests for `text/html` documents,
     * loading them in an SSR context, rendering them using the `entry-server` endpoint in the
     * user's project, and injecting the static HTML into the template.
     */
    async configureServer(server) {
      const resolve = (p: string) => path.resolve(server.config.root, p);
      async function getIndexTemplate(url: string) {
        const indexHtml = await fs.readFile(resolve('index.html'), 'utf-8');
        return await server.transformIndexHtml(url, indexHtml);
      }

      const env = await loadEnv(server.config.mode, server.config.root, '');
      for (const key of Object.keys(env)) {
        if (envPrefix.some((prefix) => key.startsWith(prefix))) {
          delete env[key];
        }
      }

      globalThis.Oxygen = {env};

      // The default vite middleware rewrites the URL `/graphqil` to `/index.html`
      // By running this middleware first, we avoid that.
      server.middlewares.use(
        graphiqlMiddleware({
          shopifyConfig,
          dev: true,
        })
      );

      return () =>
        server.middlewares.use(
          hydrogenMiddleware({
            dev: true,
            shopifyConfig,
            indexTemplate: getIndexTemplate,
            getServerEntrypoint: async () =>
              await server.ssrLoadModule(resolve('./src/entry-server')),
            devServer: server,
            cache: pluginOptions?.devCache
              ? (new InMemoryCache() as unknown as Cache)
              : undefined,
          })
        );
    },
  } as Plugin;
};
