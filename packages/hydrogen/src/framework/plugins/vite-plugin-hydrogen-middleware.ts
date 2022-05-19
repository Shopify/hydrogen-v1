import {
  Plugin,
  loadEnv,
  ResolvedConfig,
  normalizePath,
  ViteDevServer,
} from 'vite';
import bodyParser from 'body-parser';
import path from 'path';
import {promises as fs} from 'fs';
import {hydrogenMiddleware, graphiqlMiddleware} from '../middleware';
import type {HydrogenVitePluginOptions} from '../../types';
import {InMemoryCache} from '../cache/in-memory';

export const HYDROGEN_DEFAULT_SERVER_ENTRY =
  process.env.HYDROGEN_SERVER_ENTRY || '/src/App.server';

const virtualModuleId = 'virtual:hydrogen-config';
const virtualProxyModuleId = virtualModuleId + ':proxy';

const virtualHydrogenRoutes = 'virtual:hydrogen-routes.server.jsx';

export default (pluginOptions: HydrogenVitePluginOptions) => {
  let config: ResolvedConfig;
  let server: ViteDevServer;

  return {
    name: 'vite-plugin-hydrogen-middleware',
    configResolved(_config) {
      config = _config;
    },
    /**
     * By adding a middleware to the Vite dev server, we can handle SSR without needing
     * a custom node script. It works by handling any requests for `text/html` documents,
     * loading them in an SSR context, rendering them using the `entry-server` endpoint in the
     * user's project, and injecting the static HTML into the template.
     */
    async configureServer(_server) {
      server = _server;
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
              'virtual:hydrogen-config:proxy'
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
            // via `ServerComponentRequest` during production runtime.
            request.normalizedUrl = request.url;

            return typeof hydrogenConfig.shopify === 'function'
              ? hydrogenConfig.shopify(request)
              : hydrogenConfig.shopify;
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
    async resolveId(source, importer) {
      if (source === virtualModuleId) {
        const configPath = await findHydrogenConfigPath(
          config.root,
          pluginOptions.configPath
        );

        return this.resolve(configPath, importer, {
          skipSelf: true,
        });
      }

      if (source === virtualProxyModuleId) {
        // Virtual modules convention
        // https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
        return '\0' + virtualProxyModuleId;
      }

      if (source === virtualHydrogenRoutes) {
        return '\0' + virtualHydrogenRoutes;
      }
    },
    async load(id) {
      if (id === '\0' + virtualProxyModuleId) {
        // Likely due to a bug in Vite, but the config cannot be loaded
        // directly using ssrLoadModule. It needs to be proxied as follows:
        return `import hc from 'virtual:hydrogen-config'; export default hc;`;
      }

      if (id === '\0' + virtualHydrogenRoutes) {
        const {default: hc} = await server.ssrLoadModule(
          'virtual:hydrogen-config:proxy'
        );

        return {
          code:
            `import 'virtual:hydrogen-config';` +
            `\nexport default import.meta.globEager('${hc.routes}/**/*.server.[jt](s|sx)');`,
        };
      }
    },
  } as Plugin;
};

declare global {
  // eslint-disable-next-line no-var
  var Oxygen: {env: any; [key: string]: any};
}

async function polyfillOxygenEnv(config: ResolvedConfig) {
  const env = await loadEnv(config.mode, config.root, '');

  const publicPrefixes = Array.isArray(config.envPrefix)
    ? config.envPrefix
    : [config.envPrefix || ''];

  for (const key of Object.keys(env)) {
    if (publicPrefixes.some((prefix) => key.startsWith(prefix))) {
      delete env[key];
    }
  }

  globalThis.Oxygen = {env};
}

async function findHydrogenConfigPath(root: string, userProvidedPath?: string) {
  let configPath = userProvidedPath;

  if (!configPath) {
    // Find the config file in the project root
    const files = await fs.readdir(root);
    configPath = files.find((file) => /^hydrogen\.config\.[jt]s$/.test(file));
  }

  if (configPath) {
    configPath = normalizePath(configPath);

    if (!configPath.startsWith('/'))
      configPath = path.resolve(root, configPath);
  }

  return (
    configPath ||
    require.resolve(
      '@shopify/hydrogen/dist/esnext/utilities/empty-hydrogen-config.js'
    )
  );
}
