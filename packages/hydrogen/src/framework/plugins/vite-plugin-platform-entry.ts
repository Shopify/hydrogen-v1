import type {Plugin, ResolvedConfig} from 'vite';
import {HYDROGEN_DEFAULT_SERVER_ENTRY} from './vite-plugin-hydrogen-middleware';
import MagicString from 'magic-string';
import path from 'path';

const SSR_BUNDLE_NAME = 'index.js';

export default () => {
  let config: ResolvedConfig;
  return {
    name: 'vite-plugin-platform-entry',
    enforce: 'pre',
    configResolved(_config) {
      config = _config;
    },
    resolveId(source, importer) {
      if (source.includes('@shopify/hydrogen/platforms/')) {
        const hydrogenPath = path.dirname(
          require.resolve('@shopify/hydrogen/package.json')
        );
        const platformEntryName = source.split(path.sep).pop() || '';
        const platformEntryPath = path.resolve(
          hydrogenPath,
          'dist',
          'esnext',
          'platforms',
          platformEntryName
        );

        return this.resolve(platformEntryPath, importer, {
          skipSelf: true,
        });
      }

      return null;
    },
    transform(code, id) {
      if (id.includes('@shopify/hydrogen/dist/esnext/platforms/')) {
        code = code
          .replace(
            '__SERVER_ENTRY__',
            process.env.HYDROGEN_SERVER_ENTRY || HYDROGEN_DEFAULT_SERVER_ENTRY
          )
          .replace(
            '__INDEX_TEMPLATE__',
            path.resolve(
              config.root,
              config.build.outDir,
              '..',
              'client',
              'index.html'
            )
          );

        const ms = new MagicString(code);
        return {
          code: ms.toString(),
          map: ms.generateMap({file: id, source: id}),
        };
      }
    },
    generateBundle(options, bundle) {
      if (config.build.ssr) {
        const [[key, value]] = Object.entries(bundle);
        delete bundle[key];
        value.fileName = SSR_BUNDLE_NAME;
        bundle[SSR_BUNDLE_NAME] = value;
        options.entryFileNames = SSR_BUNDLE_NAME;
      }
    },
  } as Plugin;
};
