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
import {viteception} from '../viteception';

export const HYDROGEN_DEFAULT_SERVER_ENTRY =
  process.env.HYDROGEN_SERVER_ENTRY || '/src/App.server';

// The character ":" breaks Vite with Node >= 16.15. Use "_" instead
const VIRTUAL_PREFIX = 'virtual__';
const PROXY_PREFIX = 'proxy__';

const HYDROGEN_CONFIG_ID = 'hydrogen.config.ts';
const VIRTUAL_HYDROGEN_CONFIG_ID = VIRTUAL_PREFIX + HYDROGEN_CONFIG_ID;
const VIRTUAL_PROXY_HYDROGEN_CONFIG_ID =
  VIRTUAL_PREFIX + PROXY_PREFIX + HYDROGEN_CONFIG_ID;

const HYDROGEN_ROUTES_ID = 'hydrogen-routes.server.jsx';
const VIRTUAL_HYDROGEN_ROUTES_ID = VIRTUAL_PREFIX + HYDROGEN_ROUTES_ID;
export const VIRTUAL_PROXY_HYDROGEN_ROUTES_ID =
  VIRTUAL_PREFIX + PROXY_PREFIX + HYDROGEN_ROUTES_ID;

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
            // via `ServerComponentRequest` during production runtime.
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
    async resolveId(source, importer) {
      if (source === VIRTUAL_HYDROGEN_CONFIG_ID) {
        const hydrogenConfigPath = await findHydrogenConfigPath(
          config.root,
          pluginOptions.configPath
        );

        // This direct dependency on a real file
        // makes HMR work for the virtual module.
        return this.resolve(hydrogenConfigPath, importer, {
          skipSelf: true,
        });
      }

      if (
        [
          VIRTUAL_PROXY_HYDROGEN_CONFIG_ID,
          VIRTUAL_PROXY_HYDROGEN_ROUTES_ID,
          VIRTUAL_HYDROGEN_ROUTES_ID,
        ].includes(source)
      ) {
        // Virtual modules convention
        // https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention

        return '\0' + source;
      }
    },
    load(id) {
      // Likely due to a bug in Vite, but virtual modules cannot be loaded
      // directly using ssrLoadModule from a Vite plugin. It needs to be proxied as follows:
      if (id === '\0' + VIRTUAL_PROXY_HYDROGEN_CONFIG_ID) {
        return `import hc from '${VIRTUAL_HYDROGEN_CONFIG_ID}'; export default hc;`;
      }
      if (id === '\0' + VIRTUAL_PROXY_HYDROGEN_ROUTES_ID) {
        return `import hr from '${VIRTUAL_HYDROGEN_ROUTES_ID}'; export default hr;`;
      }

      if (id === '\0' + VIRTUAL_HYDROGEN_ROUTES_ID) {
        return importHydrogenConfig().then((hc) => {
          let routesPath: string =
            (typeof hc.routes === 'string' ? hc.routes : hc.routes?.files) ??
            '/src/routes';

          if (routesPath.startsWith('./')) {
            routesPath = routesPath.slice(1);
          }

          if (!routesPath.includes('*')) {
            if (!routesPath.endsWith('/')) {
              routesPath += '/';
            }

            routesPath += '**/*.server.[jt](s|sx)';
          }

          const [dirPrefix] = routesPath.split('/*');

          let code = `export default {\n  dirPrefix: '${dirPrefix}',\n  basePath: '${
            hc.routes?.basePath ?? ''
          }',\n  files: import.meta.globEager('${routesPath}')\n};`;

          if (config.command === 'serve') {
            // Add dependency on Hydrogen config for HMR
            code += `\nimport '${VIRTUAL_HYDROGEN_CONFIG_ID}';`;
          }

          return {code};
        });
      }
    },
  } as Plugin;

  async function importHydrogenConfig() {
    if (server) {
      const loaded = await server.ssrLoadModule(
        VIRTUAL_PROXY_HYDROGEN_CONFIG_ID
      );

      return loaded.default;
    }

    const {loaded} = await viteception([VIRTUAL_PROXY_HYDROGEN_CONFIG_ID]);
    return loaded[0].default;
  }
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
