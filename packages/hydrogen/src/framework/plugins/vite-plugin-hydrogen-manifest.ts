import MagicString from 'magic-string';
import type {Plugin, ResolvedConfig, ViteDevServer} from 'vite';
import type {
  HydrogenConfig,
  HydrogenManifest,
  ImportGlobEagerOutput,
} from '../../types';
import path from 'path';
import {findRoutePrefix} from '../../utilities/findRoutePrefix';

const MANIFEST_VIRTUAL_ID = '/virtual:hydrogen-manifest';

export default () => {
  let config: ResolvedConfig;
  let server: ViteDevServer;

  return {
    name: 'vite-plugin-hydrogen-manifest',

    configResolved(_config) {
      config = _config;
    },

    configureServer(_server) {
      server = _server;
    },

    resolveId(id) {
      if (id === MANIFEST_VIRTUAL_ID) {
        return id + '?virtual';
      }
    },

    async load(id) {
      if (id === MANIFEST_VIRTUAL_ID + '?virtual') {
        // TODO: Find a better way to load the hydrogen config.
        const hydrogenConfig = await server.ssrLoadModule(
          path.join(config.root, 'hydrogen.config')
        );
        const manifest = await createManifest(
          hydrogenConfig.default as HydrogenConfig
        );

        const code = new MagicString(
          `window.__hydrogenManifest = ${JSON.stringify(manifest)};`
        );

        return {
          code: code.toString(),
          map: code.generateMap({
            file: MANIFEST_VIRTUAL_ID,
            source: MANIFEST_VIRTUAL_ID,
          }),
        };
      }
    },
  } as Plugin;
};

async function createManifest(
  config: HydrogenConfig
): Promise<HydrogenManifest> {
  const routes = createPageRoutes(config.routes);

  return {
    routes,
  };
}

function createPageRoutes(
  routeConfig: HydrogenConfig['routes']
): HydrogenManifest['routes'] {
  const basePath = routeConfig.basePath ?? '';
  const dirPrefix =
    typeof routeConfig.dirPrefix === 'object' ? '' : routeConfig.dirPrefix;

  const files = (routeConfig.files ?? routeConfig) as ImportGlobEagerOutput;
  const keys = Object.keys(files);

  const commonRoutePrefix = dirPrefix ?? findRoutePrefix(keys);

  const routes = keys
    .map((key) => {
      let path = key
        .replace(commonRoutePrefix, '')
        .replace(/\.server\.(t|j)sx?$/, '')
        /**
         * Replace /index with /
         */
        .replace(/\/index$/i, '/')
        /**
         * Only lowercase the first letter. This allows the developer to use camelCase
         * dynamic paths while ensuring their standard routes are normalized to lowercase.
         */
        .replace(/\b[A-Z]/, (firstLetter) => firstLetter.toLowerCase())
        /**
         * Convert /[handle].jsx and /[...handle].jsx to /:handle.jsx for react-router-dom
         */
        .replace(
          /\[(?:[.]{3})?(\w+?)\]/g,
          (_match, param: string) => `:${param}`
        );

      if (path.endsWith('/') && path !== '/')
        path = path.substring(0, path.length - 1);

      /**
       * Catch-all routes [...handle].jsx don't need an exact match
       * https://reactrouter.com/core/api/Route/exact-bool
       */
      const exact = !/\[(?:[.]{3})(\w+?)\]/.test(key);

      if (!files[key].default && !files[key].api) {
        console.warn(
          `${key} doesn't export a default React component or an API function`
        );
      }

      return {
        path: basePath + path,
        id: key,
        // TODO: Infer this based on conventions rather than hardcode.
        parentPath: 'App',
        component: files[key].default,
        exact,
      };
    })
    .filter((route) => route.component);

  /**
   * Place static paths BEFORE dynamic paths to grant priority.
   */
  const allRoutes = [
    ...routes.filter((route) => !route.path.includes(':')),
    ...routes.filter((route) => route.path.includes(':')),
  ];

  return allRoutes.reduce((acc, route) => {
    acc[route.path] = route;
    return acc;
  }, {} as HydrogenManifest['routes']);
}
