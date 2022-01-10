import type {Plugin, ResolvedConfig} from 'vite';
import chalk from 'chalk';
import {normalizePath} from 'vite';
import path from 'path';
import {proxyClientComponent} from '../server-components';
import {resolve} from './resolver';

export default () => {
  let config: ResolvedConfig;
  const serverComponentsIds = new Set<string>();

  return {
    name: 'vite-plugin-react-server-components-shim',

    enforce: 'pre',

    configResolved(_config) {
      config = _config;
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
      if (/\.server(\.(j|t)sx?)?$/.test(id) && !/\/node_modules\//.test(id)) {
        const moduleInfo = this.getModuleInfo(id);
        serverComponentsIds.add(moduleInfo!.id);
      }

      if (!isSSR(options)) return null;

      // Wrapped components won't match this becase they end in ?no-proxy
      if (/\.client\.[jt]sx?$/.test(id)) {
        return proxyClientComponent({id});
      }

      return null;
    },

    transform(code, id) {
      /**
       * In order to allow dynamic component imports from RSC, we use Vite's import.meta.glob.
       * This replaces the glob import path placeholders in importer-dev.ts with resolved paths
       * to all client components (both user and Hydrogen components).
       *
       * NOTE: Glob import paths MUST be relative to the importer file (client-imports.ts) in
       * order to get the `?v=xxx` querystring from Vite added to the import URL.
       * If the paths are relative to the root instead, Vite won't add the querystring
       * and we will have duplicated files in the browser (with duplicated contexts, etc).
       */
      if (id.includes('/Hydration/client-imports')) {
        // eslint-disable-next-line node/no-missing-require
        const hydrogenPath = path.dirname(resolve('@shopify/hydrogen'));
        const importerPath = path.join(hydrogenPath, 'framework', 'Hydration');

        const importerToRootPath = normalizePath(
          path.relative(importerPath, config.root)
        );
        const [importerToRootNested] =
          importerToRootPath.match(/(\.\.\/)+(\.\.)?/) || [];
        const userPrefix = path.normalize(
          path.join(
            importerPath,
            importerToRootNested.replace(/\/?$/, path.sep)
          )
        );
        const userGlob = path.join(
          importerToRootPath,
          'src',
          '**/*.client.[jt]sx'
        );

        const libPrefix = hydrogenPath + path.sep;
        const libGlob = path.join(
          path.relative(importerPath, hydrogenPath),
          'components',
          '**/*.client.js'
        );

        return code
          .replace('__USER_COMPONENTS_PREFIX__', normalizePath(userPrefix))
          .replace('__USER_COMPONENTS_GLOB__', normalizePath(userGlob))
          .replace('__LIB_COMPONENTS_PREFIX__', normalizePath(libPrefix))
          .replace('__LIB_COMPONENTS_GLOB__', normalizePath(libGlob));
      }
    },
    async handleHotUpdate({modules, server, file}) {
      server.config.logger.info(chalk.green(`hmr update `) + chalk.dim(file), {
        clear: true,
        timestamp: true,
      });

      if (
        /\.client\.[jt]sx?$/.test(file) &&
        modules.some((module) =>
          [...module.importers].some((importer) =>
            /\.server(\.(j|t)sx?)?$/.test(importer.file!)
          )
        )
      ) {
        server.ws.send({
          type: 'custom',
          event: 'client-component',
          data: file,
        });

        return [];
      }
    },
  } as Plugin;

  function isSSR(options: undefined | {ssr?: boolean | undefined}): boolean {
    return !!options?.ssr;
  }
};
