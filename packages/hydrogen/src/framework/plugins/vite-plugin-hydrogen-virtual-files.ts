import {Plugin, ResolvedConfig, normalizePath, ViteDevServer} from 'vite';
import path from 'path';
import {promises as fs} from 'fs';
import type {HydrogenVitePluginOptions} from '../types.js';
import {viteception} from '../viteception.js';
import MagicString from 'magic-string';
import {isVite3} from '../../utilities/vite.js';

/* -- Plugin notes:
 * The Hydrogen framework needs to import certain files from the user app, such as
 * routes and config. A priori, we can't import these files from the framework
 * because we don't know the user path to write it in an `import * from '...'` statement.
 * Instead, we import "virtual files" that are resolved by Vite in this plugin.
 * These virtual files can include the user path and re-export the in-app files.
 */

export const HYDROGEN_DEFAULT_SERVER_ENTRY =
  process.env.HYDROGEN_SERVER_ENTRY || '/src/App.server';

// The character ":" breaks Vite with Node >= 16.15. Use "_" instead
const VIRTUAL_PREFIX = 'virtual__';
const PROXY_PREFIX = 'proxy__';

const ERROR_FILE = 'error.jsx';
const VIRTUAL_ERROR_FILE = VIRTUAL_PREFIX + ERROR_FILE;

const HYDROGEN_CONFIG_ID = 'hydrogen.config.ts';
const VIRTUAL_HYDROGEN_CONFIG_ID = VIRTUAL_PREFIX + HYDROGEN_CONFIG_ID;
export const VIRTUAL_PROXY_HYDROGEN_CONFIG_ID =
  VIRTUAL_PREFIX + PROXY_PREFIX + HYDROGEN_CONFIG_ID;

const HYDROGEN_ROUTES_ID = 'hydrogen-routes.server.jsx';
const VIRTUAL_HYDROGEN_ROUTES_ID = VIRTUAL_PREFIX + HYDROGEN_ROUTES_ID;
export const VIRTUAL_PROXY_HYDROGEN_ROUTES_ID =
  VIRTUAL_PREFIX + PROXY_PREFIX + HYDROGEN_ROUTES_ID;

const VIRTUAL_STREAM_ID = 'virtual__stream';

export default (pluginOptions: HydrogenVitePluginOptions) => {
  let config: ResolvedConfig;
  let server: ViteDevServer;
  let resolvedConfigPath: string;

  return {
    name: 'hydrogen:virtual-files',
    configResolved(_config) {
      config = _config;
    },
    configureServer(_server) {
      server = _server;
    },
    resolveId(source, importer) {
      if (source === VIRTUAL_HYDROGEN_CONFIG_ID) {
        return findHydrogenConfigPath(
          config.root,
          pluginOptions.configPath
        ).then((hcPath: string) => {
          resolvedConfigPath = normalizePath(hcPath);
          // This direct dependency on a real file
          // makes HMR work for the virtual module.
          return this.resolve(hcPath, importer, {skipSelf: true});
        });
      }

      if (
        [
          VIRTUAL_PROXY_HYDROGEN_CONFIG_ID,
          VIRTUAL_PROXY_HYDROGEN_ROUTES_ID,
          VIRTUAL_HYDROGEN_ROUTES_ID,
          VIRTUAL_ERROR_FILE,
          VIRTUAL_STREAM_ID,
        ].includes(source)
      ) {
        // Virtual modules convention
        // https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention

        return '\0' + source;
      }
    },
    load(id) {
      if (id === '\0' + VIRTUAL_STREAM_ID) {
        return {
          code: process.env.WORKER
            ? `export default {};`
            : `export {default} from 'stream';`,
        };
      }

      // Likely due to a bug in Vite, but virtual modules cannot be loaded
      // directly using ssrLoadModule from a Vite plugin. It needs to be proxied as follows:
      if (id === '\0' + VIRTUAL_PROXY_HYDROGEN_CONFIG_ID) {
        return `import hc from '${VIRTUAL_HYDROGEN_CONFIG_ID}'; export default typeof hc === 'function' ? hc() : hc;`;
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

          const importGlob = isVite3
            ? `import.meta.glob('${routesPath}', {eager: true})`
            : `import.meta.globEager('${routesPath}')`;

          let code = `export default {\n  dirPrefix: '${dirPrefix}',\n  basePath: '${
            hc.routes?.basePath ?? ''
          }',\n  files: ${importGlob}\n};`;

          if (config.command === 'serve') {
            // Add dependency on Hydrogen config for HMR
            code += `\nimport '${VIRTUAL_HYDROGEN_CONFIG_ID}';`;
          }

          return {code};
        });
      }

      if (id === '\0' + VIRTUAL_ERROR_FILE) {
        return importHydrogenConfig().then((hc) => {
          const errorPath = hc.serverErrorPage ?? '/src/Error.{jsx,tsx}';
          const code = `const errorPage = import.meta.glob("${errorPath}");\n export default Object.values(errorPage)[0];`;
          return {code};
        });
      }
    },
    transform(code, id) {
      if (id === resolvedConfigPath) {
        const s = new MagicString(code);
        // Wrap in function to avoid evaluating `Oxygen.env`
        // in the config until we have polyfilled it properly.
        s.replace(/export\s+default\s+(\w+)\s*\(/g, (all, m1) =>
          all.replace(m1, `() => ${m1}`)
        );

        return {
          code: s.toString(),
          map: s.generateMap({file: id, source: id}),
        };
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

    const {loaded} = await viteception([VIRTUAL_PROXY_HYDROGEN_CONFIG_ID], {
      root: config.root,
    });
    return loaded[0].default;
  }
};

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
      // eslint-disable-next-line node/no-missing-require
      '@shopify/hydrogen/utilities/empty-hydrogen-config'
    )
  );
}
