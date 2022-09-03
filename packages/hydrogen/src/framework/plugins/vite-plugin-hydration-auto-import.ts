import {Plugin, ResolvedConfig, normalizePath} from 'vite';
import path from 'path';
import MagicString from 'magic-string';

const HYDROGEN_ENTRY_FILE = 'hydrogen-entry-client.jsx';

/* -- Plugin notes:
 * Originally, every Hydrogen app required a `src/entry-client.jsx` file. However, this file
 * was rarely modified by the user. This plugin provides a virtual file with the same content of
 * that file, which allows to remove it by default from the file system.
 * The virtual file created here is imported in `index.html` in a script tag.
 */

export default () => {
  let config: ResolvedConfig;
  return {
    name: 'hydrogen:client-hydration-auto-import',
    enforce: 'pre',
    configResolved(_config) {
      config = _config;
    },
    resolveId(id, importer) {
      if (
        (/^\/?@shopify\/hydrogen\/entry-client$/.test(id) ||
          id.endsWith(path.sep + HYDROGEN_ENTRY_FILE)) &&
        normalizePath(importer || '').endsWith('/index.html')
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
          `import renderHydrogen from '@shopify/hydrogen/entry-client';\n` +
            `export default renderHydrogen((props) => props.children);`
        );

        return {
          code: code.toString(),
          map: {mappings: ''},
        };
      }

      return null;
    },
  } as Plugin;
};
