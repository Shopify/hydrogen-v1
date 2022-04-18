// @ts-ignore
import reactServerDomVite from '@shopify/hydrogen/vendor/react-server-dom-vite/plugin';
import {HYDROGEN_DEFAULT_SERVER_ENTRY} from './vite-plugin-hydrogen-middleware';
import {createServer, Plugin} from 'vite';
import {promises as fs} from 'fs';
import path from 'path';

export default function () {
  return [
    reactServerDomVite({
      isServerComponentImporterAllowed(importer: string, source: string) {
        return (
          // Always allow the entry server (e.g. App.server.jsx) to be imported
          // in other files such as worker.js or server.js.
          source.includes(HYDROGEN_DEFAULT_SERVER_ENTRY) ||
          /(index|entry-server|hydrogen\.config)\.[jt]s/.test(importer) ||
          // Support importing server components for testing
          // TODO: revisit this when RSC splits into two bundles
          /\.test\.[tj]sx?$/.test(importer)
        );
      },
      async findClientComponentsForClientBuild() {
        // In client build, we create a local server to discover client compoents.
        const server = await createServer({
          clearScreen: false,
          server: {middlewareMode: 'ssr'},
        });

        await Promise.all([
          // Load server entry to discover client components early
          server.ssrLoadModule(HYDROGEN_DEFAULT_SERVER_ENTRY),
          // Route globs are placed in hydrogen.config.js and need to
          // be loaded to discover client components in routes
          server.ssrLoadModule('virtual:hydrogen-config:proxy'),
        ]);

        await server.close();

        // At this point, the server has loaded all the components in the module graph
        return reactServerDomVite.findClientComponentsFromServer(server);
      },
      isClientComponent(rawId: string) {
        let [id, query = ''] = rawId.split('?');

        // Check default RSC rules plus new .shared.jsx suffix
        if (/\.client\.[jt]sx?$/.test(id)) return true;
        if (/\.(server|shared)\.[jt]sx?$/.test(id)) return false;

        // Vite exceptions
        if (/(^|&)commonjs-(proxy|module)($|&)/.test(query)) return false;
        // Hydrogen exceptions
        if (id.endsWith('/hydrogen-entry-client.jsx')) return false;
        if (id.endsWith('/hydrogen/dist/esnext/entry-client.js')) return false;

        // In Vite, JSX syntax can only be used in .jsx files -- Assume it is a client component
        if (/\.[jt]sx$/.test(id)) return true;

        // non-JS files
        if (!/\.[jt]s$/.test(id)) return false;

        // --- Check content of JS files:

        // Known React exceptions
        if (/\/react-server-dom-vite\//.test(id)) return false;
        if (/\/node_modules\/(\.vite|react(-dom)?)\//.test(id)) return false;

        // Find absolute path before reading content
        if (id.startsWith('/node_modules/')) {
          try {
            id = require.resolve(id.replace('/node_modules/', ''));
          } catch {
            console.warn(
              `Could not resolve "${id}". Assuming it is not a client component.`
            );
            return false;
          }
        } else if (id.startsWith('/dist/')) {
          // Local in Hydrogen
          id = path.join(
            path.dirname(require.resolve('@shopify/hydrogen/package.json')),
            id
          );
        }

        return fs
          .readFile(id, 'utf-8')
          .then((code) => {
            return (
              // imports React in some way
              /['"]react['"]/.test(code) &&
              // Uses createElement or jsx-runtime.
              /(createElement|jsx-runtime)/.test(code)
            );
          })
          .catch(() => {
            console.warn(
              `Warning: could not read file "${id}". Assuming it is not a client component.`
            );

            return false;
          });
      },
    }),
    {
      name: 'vite-plugin-hydrogen-rsc-disable',
      enforce: 'pre',
      transform(code, id) {
        if (/\.server\.[jt]sx/.test(id) && /[\?&]as:shared['"&]/.test(code)) {
          return transformRscDisable(code);
        }
      },
    },
  ] as Plugin[];
}

export const PREFIX = '_proxy_';

export function transformRscDisable(code: string) {
  // Support for importing shared components from 3p libs.
  // -- Input:
  // import def, {a} from 'my-package?as:shared';
  // -- Output:
  // import _proxy_def, {a as _proxy_a} from 'my-package';
  // const def = _proxy_def?.$$unwrappedValue ?? _proxy_def;
  // const a = _proxy_a?.$$unwrappedValue ?? _proxy_a;
  return code.replace(
    /^import\s+([^'"]+?)\s+(from\s+['"][^'"]+([\?&]as:shared&?)[^'"]*['"])/gm,
    (_, importCode: string, fromCode: string, query: string) => {
      const [p1, p2 = ''] = importCode.split('{');
      const defaultImport = p1.replace(',', '').trim();
      const namedImports = p2.replace(/[}\s]/gm, '').split(',').filter(Boolean);

      let newImportLine = 'import ';

      if (defaultImport) {
        newImportLine += PREFIX + defaultImport;
        if (namedImports.length > 0) {
          newImportLine += ', ';
        }
      }
      if (namedImports.length > 0) {
        newImportLine +=
          '{' +
          namedImports.map((item) => `${item} as ${PREFIX}${item}`).join(',') +
          '}';
      }

      // Remove token to avoid duplicating files
      newImportLine +=
        ' ' +
        fromCode.replace(query, query.endsWith('&') ? query.charAt(0) : '');

      return (
        newImportLine +
        ';\n' +
        namedImports
          .concat(defaultImport || [])
          .map(
            (key: string) =>
              `const ${key} = ${PREFIX}${key}?.$$unwrappedValue ?? ${PREFIX}${key}`
          )
          .join(';')
      );
    }
  );
}
