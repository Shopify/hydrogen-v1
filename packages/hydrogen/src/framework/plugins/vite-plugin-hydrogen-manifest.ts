import MagicString from 'magic-string';
import type {Plugin, ResolvedConfig, ViteDevServer} from 'vite';
import type {HydrogenConfig} from '../../types';
import path from 'path';

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

interface HydrogenManifest {
  routes: {
    [routeId: string]: {
      id: string;
      parentId?: string;
    };
  };
}

async function createManifest(
  config: HydrogenConfig
): Promise<HydrogenManifest> {
  const routes: HydrogenManifest['routes'] = {
    App: {id: 'App'},
  };

  for (const routeKey in config.routes) {
    // TODO: Pass in a the configurable prefix
    const id = getRouteIdFromPath({path: routeKey});
    routes[id] = {
      id,
      // TODO: Properly find parentId based on nested routes or associated layout components
      parentId: 'App',
    };
  }

  return {
    routes,
  };
}

function getRouteIdFromPath({
  path,
  prefix = './src/routes/',
  suffix = /\.server\.[jt]sx?$/,
}: {
  path: string;
  prefix?: string;
  suffix?: any;
}) {
  return path.replace(prefix, '').replace(suffix, '');
}
