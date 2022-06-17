"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HYDROGEN_DEFAULT_SERVER_ENTRY = void 0;
const vite_1 = require("vite");
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const middleware_1 = require("../middleware");
const in_memory_1 = require("../cache/in-memory");
const vite_plugin_hydrogen_virtual_files_1 = require("./vite-plugin-hydrogen-virtual-files");
exports.HYDROGEN_DEFAULT_SERVER_ENTRY = process.env.HYDROGEN_SERVER_ENTRY || '/src/App.server';
exports.default = (pluginOptions) => {
    return {
        name: 'hydrogen:middleware',
        /**
         * By adding a middleware to the Vite dev server, we can handle SSR without needing
         * a custom node script. It works by handling any requests for `text/html` documents,
         * loading them in an SSR context, rendering them using the `entry-server` endpoint in the
         * user's project, and injecting the static HTML into the template.
         */
        async configureServer(server) {
            const resolve = (p) => path_1.default.resolve(server.config.root, p);
            async function getIndexTemplate(url) {
                const indexHtml = await fs_1.promises.readFile(resolve('index.html'), 'utf-8');
                return await server.transformIndexHtml(url, indexHtml);
            }
            await polyfillOxygenEnv(server.config);
            // The default vite middleware rewrites the URL `/graphqil` to `/index.html`
            // By running this middleware first, we avoid that.
            server.middlewares.use((0, middleware_1.graphiqlMiddleware)({
                dev: true,
                getShopifyConfig: async (incomingMessage) => {
                    const { default: hydrogenConfig } = await server.ssrLoadModule(vite_plugin_hydrogen_virtual_files_1.VIRTUAL_PROXY_HYDROGEN_CONFIG_ID);
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
            server.middlewares.use(body_parser_1.default.raw({ type: '*/*' }));
            return () => server.middlewares.use((0, middleware_1.hydrogenMiddleware)({
                dev: true,
                indexTemplate: getIndexTemplate,
                getServerEntrypoint: () => server.ssrLoadModule(exports.HYDROGEN_DEFAULT_SERVER_ENTRY),
                devServer: server,
                cache: pluginOptions?.devCache
                    ? new in_memory_1.InMemoryCache()
                    : undefined,
            }));
        },
    };
};
async function polyfillOxygenEnv(config) {
    const env = await (0, vite_1.loadEnv)(config.mode, config.root, '');
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
