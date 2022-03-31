import {Plugin, ResolvedConfig, normalizePath} from 'vite';
import path from 'path';
import MagicString from 'magic-string';

const HYDROGEN_ENTRY_FILE = 'hydrogen-entry-client.jsx';

export default (hydrogenConfig: any) => {
  let config: ResolvedConfig;
  return {
    name: 'vite-plugin-hydration-auto-import',
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
        let code;

        if (hydrogenConfig?.experimental?.serverComponents) {
          code = new MagicString(
            `import renderHydrogen from '@shopify/hydrogen/entry-client';\n` +
              `export default renderHydrogen((props) => props.children);`
          );
        } else {
          code = new MagicString(
            `import renderHydrogen from '@shopify/hydrogen/entry-client';\n` +
              `import App, {routes} from './src/App';\n` +
              `window.__hydrogenRoutes = routes;\n` +
              `export default renderHydrogen(App);`
          );
        }

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
