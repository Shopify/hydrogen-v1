import { normalizePath } from 'vite';
import path from 'path';
import { promises as fs } from 'fs';
import { viteception } from '../viteception';
export const HYDROGEN_DEFAULT_SERVER_ENTRY = process.env.HYDROGEN_SERVER_ENTRY || '/src/App.server';
// The character ":" breaks Vite with Node >= 16.15. Use "_" instead
const VIRTUAL_PREFIX = 'virtual__';
const PROXY_PREFIX = 'proxy__';
const HYDROGEN_CONFIG_ID = 'hydrogen.config.ts';
const VIRTUAL_HYDROGEN_CONFIG_ID = VIRTUAL_PREFIX + HYDROGEN_CONFIG_ID;
export const VIRTUAL_PROXY_HYDROGEN_CONFIG_ID = VIRTUAL_PREFIX + PROXY_PREFIX + HYDROGEN_CONFIG_ID;
const HYDROGEN_ROUTES_ID = 'hydrogen-routes.server.jsx';
const VIRTUAL_HYDROGEN_ROUTES_ID = VIRTUAL_PREFIX + HYDROGEN_ROUTES_ID;
export const VIRTUAL_PROXY_HYDROGEN_ROUTES_ID = VIRTUAL_PREFIX + PROXY_PREFIX + HYDROGEN_ROUTES_ID;
export default (pluginOptions) => {
    let config;
    let server;
    return {
        name: 'hydrogen:virtual-files',
        configResolved(_config) {
            config = _config;
        },
        configureServer(_server) {
            server = _server;
        },
        resolveId(source, importer) {
            if (source === VIRTUAL_HYDROGEN_CONFIG_ID) {
                return findHydrogenConfigPath(config.root, pluginOptions.configPath).then((hcPath) => 
                // This direct dependency on a real file
                // makes HMR work for the virtual module.
                this.resolve(hcPath, importer, { skipSelf: true }));
            }
            if ([
                VIRTUAL_PROXY_HYDROGEN_CONFIG_ID,
                VIRTUAL_PROXY_HYDROGEN_ROUTES_ID,
                VIRTUAL_HYDROGEN_ROUTES_ID,
            ].includes(source)) {
                // Virtual modules convention
                // https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
                return '\0' + source;
            }
        },
        load(id) {
            // Likely due to a bug in Vite, but virtual modules cannot be loaded
            // directly using ssrLoadModule from a Vite plugin. It needs to be proxied as follows:
            if (id === '\0' + VIRTUAL_PROXY_HYDROGEN_CONFIG_ID) {
                return `import hc from '${VIRTUAL_HYDROGEN_CONFIG_ID}'; export default hc;`;
            }
            if (id === '\0' + VIRTUAL_PROXY_HYDROGEN_ROUTES_ID) {
                return `import hr from '${VIRTUAL_HYDROGEN_ROUTES_ID}'; export default hr;`;
            }
            if (id === '\0' + VIRTUAL_HYDROGEN_ROUTES_ID) {
                return importHydrogenConfig().then((hc) => {
                    let routesPath = (typeof hc.routes === 'string' ? hc.routes : hc.routes?.files) ??
                        '/src/routes';
                    if (routesPath.startsWith('./')) {
                        routesPath = routesPath.slice(1);
                    }
                    if (!routesPath.includes('*')) {
                        if (!routesPath.endsWith('/')) {
                            routesPath += '/';
                        }
                        routesPath += '**/*.server.[jt](s|sx)';
                    }
                    const [dirPrefix] = routesPath.split('/*');
                    let code = `export default {\n  dirPrefix: '${dirPrefix}',\n  basePath: '${hc.routes?.basePath ?? ''}',\n  files: import.meta.globEager('${routesPath}')\n};`;
                    if (config.command === 'serve') {
                        // Add dependency on Hydrogen config for HMR
                        code += `\nimport '${VIRTUAL_HYDROGEN_CONFIG_ID}';`;
                    }
                    return { code };
                });
            }
        },
    };
    async function importHydrogenConfig() {
        if (server) {
            const loaded = await server.ssrLoadModule(VIRTUAL_PROXY_HYDROGEN_CONFIG_ID);
            return loaded.default;
        }
        const { loaded } = await viteception([VIRTUAL_PROXY_HYDROGEN_CONFIG_ID]);
        return loaded[0].default;
    }
};
async function findHydrogenConfigPath(root, userProvidedPath) {
    let configPath = userProvidedPath;
    if (!configPath) {
        // Find the config file in the project root
        const files = await fs.readdir(root);
        configPath = files.find((file) => /^hydrogen\.config\.[jt]s$/.test(file));
    }
    if (configPath) {
        configPath = normalizePath(configPath);
        if (!configPath.startsWith('/'))
            configPath = path.resolve(root, configPath);
    }
    return (configPath ||
        require.resolve(
        // eslint-disable-next-line node/no-missing-require
        '@shopify/hydrogen/utilities/empty-hydrogen-config'));
}
