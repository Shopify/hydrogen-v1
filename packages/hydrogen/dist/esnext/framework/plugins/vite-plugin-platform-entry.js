import { normalizePath } from 'vite';
import { HYDROGEN_DEFAULT_SERVER_ENTRY } from './vite-plugin-hydrogen-middleware';
import MagicString from 'magic-string';
import path from 'path';
import fs from 'fs';
const SSR_BUNDLE_NAME = 'index.js';
export default () => {
    let config;
    let isESM;
    return {
        name: 'vite-plugin-platform-entry',
        enforce: 'pre',
        configResolved(_config) {
            config = _config;
            if (config.build.ssr) {
                const { output = {} } = config.build.rollupOptions || {};
                const { format = '' } = (Array.isArray(output) ? output[0] : output) || {};
                isESM = Boolean(process.env.WORKER) || ['es', 'esm'].includes(format);
            }
        },
        resolveId(source, importer) {
            if (normalizePath(source).includes('/hydrogen/platforms/')) {
                const hydrogenPath = path.dirname(require.resolve('@shopify/hydrogen/package.json'));
                const platformEntryName = source.split(path.sep).pop() || '';
                const platformEntryPath = path.resolve(hydrogenPath, 'dist', 'esnext', 'platforms', platformEntryName);
                return this.resolve(platformEntryPath, importer, {
                    skipSelf: true,
                });
            }
            return null;
        },
        transform(code, id) {
            if (normalizePath(id).includes('/hydrogen/dist/esnext/platforms/')) {
                const ms = new MagicString(code);
                ms.replace('__SERVER_ENTRY__', HYDROGEN_DEFAULT_SERVER_ENTRY);
                const indexTemplatePath = normalizePath(path.resolve(config.root, config.build.outDir, '..', 'client', 'index.html'));
                ms.replace('__INDEX_TEMPLATE__', indexTemplatePath);
                return {
                    code: ms.toString(),
                    map: ms.generateMap({ file: id, source: id }),
                };
            }
        },
        generateBundle(options, bundle) {
            if (config.build.ssr) {
                const [key, value] = Object.entries(bundle).find(([, value]) => value.type === 'chunk' && value.isEntry);
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
                    exports: { '.': mainFile, [mainFile]: mainFile },
                };
                fs.writeFileSync(path.join(options.dir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf-8');
            }
        },
    };
};
