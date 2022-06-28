import {Plugin, ResolvedConfig, normalizePath} from 'vite';
import {HYDROGEN_DEFAULT_SERVER_ENTRY} from './vite-plugin-hydrogen-middleware';
import MagicString from 'magic-string';
import path from 'path';
import fs from 'fs';

const SSR_BUNDLE_NAME = 'index.js';

// Keep this in the outer scope to share it
// across client <> server builds.
let clientBuildPath: string;

export default () => {
  let config: ResolvedConfig;
  let isESM: boolean;
  let ssrBuildEntry: string;

  return {
    name: 'vite-plugin-platform-entry',
    enforce: 'pre',
    configResolved(_config) {
      config = _config;

      if (config.build.ssr) {
        const {output = {}} = config.build.rollupOptions || {};
        const {format = ''} =
          (Array.isArray(output) ? output[0] : output) || {};

        isESM = Boolean(process.env.WORKER) || ['es', 'esm'].includes(format);

        ssrBuildEntry = normalizePath(resolveSsrEntry(config));
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
    transform(code, id) {
      if (
        config.command === 'build' &&
        config.build.ssr &&
        normalizePath(id) === ssrBuildEntry
      ) {
        const ms = new MagicString(code);

        ms.replace('__HYDROGEN_ENTRY__', HYDROGEN_DEFAULT_SERVER_ENTRY);

        if (!clientBuildPath) {
          // Default value
          clientBuildPath = path.resolve(
            config.root,
            config.build.outDir,
            '..',
            'client'
          );
        }

        ms.replace(
          '__HYDROGEN_HTML_TEMPLATE__',
          normalizePath(path.resolve(clientBuildPath, 'index.html')) + '?raw'
        );

        ms.replace(
          '__HYDROGEN_RELATIVE_CLIENT_BUILD__',
          path.relative(
            path.resolve(config.root, config.build.outDir),
            clientBuildPath
          )
        );

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
        clientBuildPath = path.resolve(config.root, config.build.outDir);
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

function resolveSsrEntry(config: ResolvedConfig) {
  const providedSsrEntry =
    typeof config.build.ssr === 'string'
      ? config.build.ssr
      : (config.build.rollupOptions.input as string);

  try {
    return require.resolve(providedSsrEntry);
  } catch (error: any) {
    try {
      // When the --ssr flag points to a local file without
      // using relative path, it needs to be resolved first.
      // E.g. `--ssr worker` instead of `--ssr ./worker`
      return require.resolve(path.resolve(config.root, providedSsrEntry));
    } catch {
      /* */
    }

    error.message = `Could not resolve SSR entry file. ` + error.message;
    throw error;
  }
}
