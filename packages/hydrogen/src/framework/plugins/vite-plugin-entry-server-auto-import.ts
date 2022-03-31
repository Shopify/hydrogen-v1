import {Plugin, ResolvedConfig} from 'vite';
import path from 'path';
import MagicString from 'magic-string';

const HYDROGEN_ENTRY_FILE = 'hydrogen-entry-server.jsx';

export default () => {
  let config: ResolvedConfig;
  return {
    name: 'vite-plugin-entry-server-auto-import',
    enforce: 'pre',
    configResolved(_config) {
      config = _config;
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
      if (id.includes(HYDROGEN_ENTRY_FILE + '?virtual')) {
        const code = new MagicString(
          `import renderHydrogen from '@shopify/hydrogen/entry-server';\n` +
            `import * as entrypoint from './src/App';\n` +
            `import shopifyConfig from './shopify.config.js';\n` +
            `export default renderHydrogen(entrypoint.default, {routes: entrypoint.routes, shopifyConfig});`
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
