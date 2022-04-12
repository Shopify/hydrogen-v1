import {Plugin, loadEnv, ResolvedConfig, normalizePath} from 'vite';
import bodyParser from 'body-parser';
import path from 'path';
import {promises as fs} from 'fs';
import {hydrogenMiddleware, graphiqlMiddleware} from '../middleware';
import type {HydrogenVitePluginOptions} from '../../types';
import {InMemoryCache} from '../cache/in-memory';

export const HYDROGEN_DEFAULT_SERVER_ENTRY = '/src/App.server';

export default (pluginOptions: HydrogenVitePluginOptions) => {
  let config: ResolvedConfig;

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
            const {default: hydrogenConfigExport} = await server.ssrLoadModule(
              'virtual:hydrogen-config-no-globs'
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

            const hydrogenConfig =
              typeof hydrogenConfigExport === 'function'
                ? await hydrogenConfigExport(url, request)
                : hydrogenConfigExport;

            if (typeof hydrogenConfig.shopify !== 'function')
              return hydrogenConfig.shopify;

            return hydrogenConfig.shopify(url, request);
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
              server.ssrLoadModule(
                process.env.HYDROGEN_SERVER_ENTRY ||
                  HYDROGEN_DEFAULT_SERVER_ENTRY
              ),
            devServer: server,
            cache: pluginOptions?.devCache
              ? (new InMemoryCache() as unknown as Cache)
              : undefined,
          })
        );
    },
    async resolveId(source, importer) {
      if (source === 'virtual:hydrogen-config') {
        const configPath = await findHydrogenConfigPath(
          config.root,
          pluginOptions.configPath
        );

        return this.resolve(configPath, importer, {
          skipSelf: true,
        });
      }
    },
    async load(id) {
      if (id.startsWith('virtual:hydrogen-config-no-globs')) {
        const configPath = await findHydrogenConfigPath(
          config.root,
          pluginOptions.configPath
        );

        const hydrogenConfigCode = await fs.readFile(configPath, 'utf-8');

        // Remove import globs to avoid loading React components here.
        return hydrogenConfigCode.replace(
          /import\.meta.glob(Eager)?\(['"`][^'"`]+['"`]\)/gm,
          '{}'
        );
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
