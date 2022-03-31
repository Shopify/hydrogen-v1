import {Plugin, ResolvedConfig} from 'vite';
import path from 'path';
import fs from 'fs';
import MagicString from 'magic-string';
import {
  HYDROGEN_DEFAULT_LEGACY_ENTRY,
  HYDROGEN_DEFAULT_SERVER_ENTRY,
} from './vite-plugin-hydrogen-middleware';

const HYDROGEN_ENTRY_FILE = 'hydrogen-entry-server.jsx';

export default (hydrogenConfig: any) => {
  let config: ResolvedConfig;
  let hydrogenConfigExists = false;
  return {
    name: 'vite-plugin-entry-server-auto-import',
    enforce: 'pre',
    configResolved(_config) {
      config = _config;
      hydrogenConfigExists = fs.existsSync(
        path.join(config.root, 'hydrogen.config.js')
      );
      console.log({hydrogenConfigExists});
    },
    resolveId(id) {
      if (
        /^\/?@shopify\/hydrogen\/server$/.test(id) ||
        id.endsWith(path.sep + HYDROGEN_ENTRY_FILE)
      ) {
        // Make this virtual import look like a local project file
        // to enable React Refresh normally.
        return path.join(config.root, HYDROGEN_ENTRY_FILE + '?virtual');
      }

      return null;
    },
    load(id) {
      const serverEntrypoint =
        process.env.HYDROGEN_SERVER_ENTRY ||
        hydrogenConfig?.experimental?.serverComponents
          ? HYDROGEN_DEFAULT_SERVER_ENTRY
          : HYDROGEN_DEFAULT_LEGACY_ENTRY;
      if (id.includes(HYDROGEN_ENTRY_FILE + '?virtual')) {
        const code = new MagicString(
          `import renderHydrogen from '@shopify/hydrogen/entry-server';\n` +
            `import * as entrypoint from '.${serverEntrypoint}';\n` +
            `import shopifyConfig from './shopify.config.js';\n`
        );

        if (hydrogenConfigExists) {
          code.append(`import hydrogenConfig from './hydrogen.config.js';\n`);
        }

        code.append(
          `export default renderHydrogen(entrypoint.default, {routes: entrypoint.routes, ${
            hydrogenConfigExists ? 'hydrogenConfig, ' : ''
          }shopifyConfig});`
        );

        return {
          code: code.toString(),
          map: code.generateMap({
            file: HYDROGEN_ENTRY_FILE,
            source: HYDROGEN_ENTRY_FILE,
          }),
        };
      }

      return null;
    },
  } as Plugin;
};
