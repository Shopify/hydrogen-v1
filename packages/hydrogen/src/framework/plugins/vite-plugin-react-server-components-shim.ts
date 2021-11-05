import type {Plugin, ResolvedConfig} from 'vite';
import path from 'path';
import {promises as fs} from 'fs';
import glob from 'fast-glob';
import {proxyClientComponent} from '../server-components';

export default () => {
  let config: ResolvedConfig;

  let clientManifest: any;

  return {
    name: 'vite-plugin-react-server-components-shim',

    enforce: 'pre',

    configResolved(_config) {
      config = _config;
    },

    buildStart() {
      if (config.build.ssr || config.command !== 'build') return;

      const hydrogenComponentPath = path.dirname(
        // eslint-disable-next-line node/no-missing-require
        require.resolve('@shopify/hydrogen')
      );

      /**
       * Grab each of the client components in this project and emit them as chunks.
       * This allows us to dynamically import them later during partial hydration in production.
       */
      const clientComponents = glob
        .sync(path.resolve(config.root, './src/**/*.client.(j|t)sx'))
        .concat(glob.sync(path.join(hydrogenComponentPath, '**/*.client.js')));

      clientComponents.forEach((id) => {
        this.emitFile({
          type: 'chunk',
          id,
          preserveSignature: 'strict',
        });
      });
    },

    async resolveId(source, importer) {
      if (!importer) return null;

      /**
       * Throw errors when non-Server Components try to load Server Components.
       */
      if (
        /\.server(\.(j|t)sx?)?$/.test(source) &&
        !/\.server\.(j|t)sx?$/.test(importer) &&
        // Ignore entrypoints, index re-exports, ClientMarker, handle-worker-event
        !/(entry-server\.(j|t)sx?|index\.(html|js)|ClientMarker\.js|handle-worker-event\.js)(\?v=.*)?$/.test(
          importer
        )
      ) {
        throw new Error(
          `Cannot import ${source} from "${importer}". ` +
            'By convention, Server Components can only be imported from other Server Component files. ' +
            'That way nobody accidentally sends these to the client by indirectly importing it.'
        );
      }

      /**
       * Throw errors when Client Components try to load Hydrogen components from the
       * server-only entrypoint.
       */
      if (
        /@shopify\/hydrogen$/.test(source) &&
        /\.client\.(j|t)sx?$/.test(importer)
      ) {
        throw new Error(
          `Cannot import @shopify/hydrogen from "${importer}". ` +
            'When using Hydrogen components within Client Components, use the `@shopify/hydrogen/client` entrypoint instead.'
        );
      }
    },

    async load(id, options) {
      if (!isSSR(options)) return null;

      // Wrapped components won't match this becase they end in ?no-proxy
      if (/\.client\.[jt]sx?$/.test(id)) {
        return await proxyClientComponent({
          id,
          isBuild: config.command === 'build',
          getFileFromClientManifest,
          root: config.root,
        });
      }

      return null;
    },
  } as Plugin;

  // Mitigation for upcoming minor Vite update
  // https://github.com/vitejs/vite/pull/5253
  // TO-DO: When the vite package is updated with the above Vite PR,
  // clean up this function and treat `options` param as objects
  // from this point forward
  // Timeline: Targetting for Vite 2.7
  function isSSR(options: undefined | boolean | {ssr: boolean}): boolean {
    if (typeof options === 'boolean') {
      return options;
    }
    if (typeof options === 'object') {
      return !!options.ssr;
    }
    return false;
  }

  async function getFileFromClientManifest(manifestId: string) {
    const manifest = await getClientManifest();

    const fileName = '/' + manifestId.split('/').pop()!;
    const matchingKey = Object.keys(manifest).find((key) =>
      key.endsWith(fileName)
    );

    if (!matchingKey) {
      throw new Error(
        `Could not find a matching entry in the manifest for: ${manifestId}`
      );
    }

    return manifest[matchingKey].file;
  }

  async function getClientManifest() {
    if (config.command !== 'build') {
      return {};
    }

    if (clientManifest) return clientManifest;

    try {
      const manifest = JSON.parse(
        await fs.readFile(
          path.resolve(config.root, './dist/client/manifest.json'),
          'utf-8'
        )
      );

      clientManifest = manifest;

      return manifest;
    } catch (e) {
      console.error(`Failed to load client manifest:`);
      console.error(e);
    }
  }
};
