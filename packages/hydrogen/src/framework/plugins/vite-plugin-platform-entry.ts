import {Plugin, ResolvedConfig, normalizePath} from 'vite';
import {HYDROGEN_DEFAULT_SERVER_ENTRY} from './vite-plugin-hydrogen-middleware.js';
import MagicString from 'magic-string';
import path from 'path';
import fs from 'fs';
import fastGlob from 'fast-glob';
import {isVite3} from '../../utilities/vite.js';

const SSR_BUNDLE_NAME = 'index.js';

// Keep this in the outer scope to share it
// across client <> server builds.
let clientBuildPath: string;

/* -- Plugin notes:
 * This plugin simplifies the way a platform entry file imports user files. This is
 * needed to write generic integrations with different platform providers.
 *
 * Instead of using relative paths:
 * `import handleRequest from '../../<arbitrary_path>/src/App.server';`
 * `import indexTemplate from '../../<arbitrary_path>/dist/client/index.html?raw';`
 *
 *  It allows importing from a known static path which dynamically resolves the user files:
 * `import {handleRequest, indexTemplate} from '@shopify/hydrogen/platforms';`
 *
 */

export default () => {
  let config: ResolvedConfig;
  let isESM: boolean;

  return {
    name: 'hydrogen:platform-entry',
    enforce: 'pre',
    configResolved(_config) {
      config = _config;

      if (config.build.ssr) {
        const {output = {}} = config.build.rollupOptions || {};
        const {format = isVite3 ? 'es' : ''} =
          (Array.isArray(output) ? output[0] : output) || {};

        isESM = Boolean(process.env.WORKER) || ['es', 'esm'].includes(format);
      }
    },
    resolveId(source, importer) {
      if (normalizePath(source).includes('/hydrogen/platforms/')) {
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
    async transform(code, id, options) {
      if (
        config.command === 'build' &&
        options?.ssr &&
        /\/hydrogen\/.+platforms\/virtual\./.test(normalizePath(id))
      ) {
        const ms = new MagicString(code);

        ms.replace('__HYDROGEN_ENTRY__', HYDROGEN_DEFAULT_SERVER_ENTRY);

        if (!clientBuildPath) {
          // Default value
          clientBuildPath = normalizePath(
            path.resolve(config.root, config.build.outDir, '..', 'client')
          );
        }

        ms.replace(
          '__HYDROGEN_HTML_TEMPLATE__',
          normalizePath(path.resolve(clientBuildPath, 'index.html'))
        );

        ms.replace(
          '__HYDROGEN_RELATIVE_CLIENT_BUILD__',
          normalizePath(
            path.relative(
              normalizePath(path.resolve(config.root, config.build.outDir)),
              clientBuildPath
            )
          )
        );

        const files = clientBuildPath
          ? (
              await fastGlob('**/*', {
                cwd: clientBuildPath,
                ignore: ['**/index.html', `**/${config.build.assetsDir}/**`],
              })
            ).map((file) => '/' + file)
          : [];

        ms.replace("\\['__HYDROGEN_ASSETS__'\\]", JSON.stringify(files));
        ms.replace('__HYDROGEN_ASSETS_DIR__', config.build.assetsDir);
        ms.replace(
          '__HYDROGEN_ASSETS_BASE_URL__',
          (process.env.HYDROGEN_ASSET_BASE_URL || '').replace(/\/$/, '')
        );

        // Remove the poison pill
        ms.replace('throw', '//');

        return {
          code: ms.toString(),
          map: ms.generateMap({file: id, source: id}),
        };
      }
    },
    buildEnd(err) {
      if (!err && !config.build.ssr && config.command === 'build') {
        // Save outDir from client build in the outer scope in order
        // to read it during the server build. The CLI runs Vite in
        // the same process so the scope is shared across builds.
        clientBuildPath = normalizePath(
          path.resolve(config.root, config.build.outDir)
        );
      }
    },
    generateBundle(options, bundle) {
      if (config.build.ssr) {
        const [key, value] = Object.entries(bundle).find(
          ([, value]) => value.type === 'chunk' && value.isEntry
        )!;

        delete bundle[key];
        value.fileName = SSR_BUNDLE_NAME;
        bundle[SSR_BUNDLE_NAME] = value;

        // This ensures the file has a proper
        // default export instead of exporting an
        // object containing a 'default' property.
        if (value.type === 'chunk' && !isESM) {
          value.code += `\nmodule.exports = exports.default || exports;`;
        }
      }
    },
    writeBundle(options) {
      if (config.build.ssr && options.dir) {
        const mainFile = `./${SSR_BUNDLE_NAME}`;
        const packageJson = {
          type: isESM ? 'module' : 'commonjs',
          main: mainFile,
          exports: {'.': mainFile, [mainFile]: mainFile},
        };

        fs.writeFileSync(
          path.join(options.dir, 'package.json'),
          JSON.stringify(packageJson, null, 2),
          'utf-8'
        );
      }
    },
  } as Plugin;
};
