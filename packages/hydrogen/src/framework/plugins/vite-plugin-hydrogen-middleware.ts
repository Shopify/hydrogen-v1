import {Plugin, loadEnv, ResolvedConfig} from 'vite';
import bodyParser from 'body-parser';
import path from 'path';
import {promises as fs} from 'fs';
import {hydrogenMiddleware, graphiqlMiddleware} from '../middleware.js';
import type {HydrogenVitePluginOptions} from '../types.js';
import {InMemoryCache} from '../cache/in-memory.js';
import {VIRTUAL_PROXY_HYDROGEN_CONFIG_ID} from './vite-plugin-hydrogen-virtual-files.js';

export const HYDROGEN_DEFAULT_SERVER_ENTRY =
  process.env.HYDROGEN_SERVER_ENTRY || '/src/App.server';

/* -- Plugin notes:
 * By adding a middleware to the Vite dev server, we can handle SSR without needing
 * a custom node script. It works by handling any requests for `text/html` documents,
 * loading them in an SSR context, rendering them using the `entry-server` endpoint in the
 * user's project, and injecting the static HTML into the template.
 */

export default (pluginOptions: HydrogenVitePluginOptions) => {
  return {
    name: 'hydrogen:middleware',

    async configureServer(server) {
      const resolve = (p: string) => path.resolve(server.config.root, p);
      async function getIndexTemplate(url: string) {
        const indexHtml = await fs.readFile(resolve('index.html'), 'utf-8');
        return await server.transformIndexHtml(url, indexHtml);
      }

      await polyfillOxygenEnv(server.config);

      // The default vite middleware rewrites the URL `/graphqil` to `/index.html`
      // By running this middleware first, we avoid that.
      server.middlewares.use(
        graphiqlMiddleware({
          dev: true,
          getShopifyConfig: async (incomingMessage) => {
            const {default: hydrogenConfig} = await server.ssrLoadModule(
              VIRTUAL_PROXY_HYDROGEN_CONFIG_ID
            );

            // @ts-ignore
            const {address = 'localhost', port = '3000'} =
              server.httpServer?.address() || {};
            const url = new URL(
              `http://${address}:${port}${incomingMessage.url}`
            );
            const request = new Request(url.toString(), {
              headers: incomingMessage.headers as any,
            });

            // @ts-expect-error Manually set `normalizedUrl` which a developer expects to be available
            // via `HydrogenRequest` during production runtime.
            request.normalizedUrl = request.url;

            const {shopify} = hydrogenConfig;
            return typeof shopify === 'function' ? shopify(request) : shopify;
          },
        })
      );

      server.middlewares.use(bodyParser.raw({type: '*/*'}));

      return () =>
        server.middlewares.use(
          hydrogenMiddleware({
            dev: true,
            indexTemplate: getIndexTemplate,
            getServerEntrypoint: () =>
              server.ssrLoadModule(HYDROGEN_DEFAULT_SERVER_ENTRY),
            devServer: server,
            cache: pluginOptions?.devCache
              ? (new InMemoryCache() as unknown as Cache)
              : undefined,
          })
        );
    },
  } as Plugin;
};

declare global {
  // eslint-disable-next-line no-var
  var Oxygen: {env: any; [key: string]: any};
}

async function polyfillOxygenEnv(config: ResolvedConfig) {
  const env = await loadEnv(config.mode, config.root, '');

  globalThis.Oxygen = {env};
}
