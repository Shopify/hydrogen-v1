import { loadEnv } from 'vite';
import bodyParser from 'body-parser';
import path from 'path';
import { promises as fs } from 'fs';
import { hydrogenMiddleware, graphiqlMiddleware } from '../middleware';
import { InMemoryCache } from '../cache/in-memory';
import { VIRTUAL_PROXY_HYDROGEN_CONFIG_ID } from './vite-plugin-hydrogen-virtual-files';
export const HYDROGEN_DEFAULT_SERVER_ENTRY = process.env.HYDROGEN_SERVER_ENTRY || '/src/App.server';
export default (pluginOptions) => {
    return {
        name: 'hydrogen:middleware',
        /**
         * By adding a middleware to the Vite dev server, we can handle SSR without needing
         * a custom node script. It works by handling any requests for `text/html` documents,
         * loading them in an SSR context, rendering them using the `entry-server` endpoint in the
         * user's project, and injecting the static HTML into the template.
         */
        async configureServer(server) {
            const resolve = (p) => path.resolve(server.config.root, p);
            async function getIndexTemplate(url) {
                const indexHtml = await fs.readFile(resolve('index.html'), 'utf-8');
                return await server.transformIndexHtml(url, indexHtml);
            }
            await polyfillOxygenEnv(server.config);
            // The default vite middleware rewrites the URL `/graphqil` to `/index.html`
            // By running this middleware first, we avoid that.
            server.middlewares.use(graphiqlMiddleware({
                dev: true,
                getShopifyConfig: async (incomingMessage) => {
                    const { default: hydrogenConfig } = await server.ssrLoadModule(VIRTUAL_PROXY_HYDROGEN_CONFIG_ID);
                    // @ts-ignore
                    const { address = 'localhost', port = '3000' } = server.httpServer?.address() || {};
                    const url = new URL(`http://${address}:${port}${incomingMessage.url}`);
                    const request = new Request(url.toString(), {
                        headers: incomingMessage.headers,
                    });
                    // @ts-expect-error Manually set `normalizedUrl` which a developer expects to be available
                    // via `HydrogenRequest` during production runtime.
                    request.normalizedUrl = request.url;
                    const { shopify } = hydrogenConfig;
                    return typeof shopify === 'function' ? shopify(request) : shopify;
                },
            }));
            server.middlewares.use(bodyParser.raw({ type: '*/*' }));
            return () => server.middlewares.use(hydrogenMiddleware({
                dev: true,
                indexTemplate: getIndexTemplate,
                getServerEntrypoint: () => server.ssrLoadModule(HYDROGEN_DEFAULT_SERVER_ENTRY),
                devServer: server,
                cache: pluginOptions?.devCache
                    ? new InMemoryCache()
                    : undefined,
            }));
        },
    };
};
async function polyfillOxygenEnv(config) {
    const env = await loadEnv(config.mode, config.root, '');
    const publicPrefixes = Array.isArray(config.envPrefix)
        ? config.envPrefix
        : [config.envPrefix || ''];
    for (const key of Object.keys(env)) {
        if (publicPrefixes.some((prefix) => key.startsWith(prefix))) {
            delete env[key];
        }
    }
    globalThis.Oxygen = { env };
}
