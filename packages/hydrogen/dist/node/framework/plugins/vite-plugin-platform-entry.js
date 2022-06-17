"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const vite_plugin_hydrogen_middleware_1 = require("./vite-plugin-hydrogen-middleware");
const magic_string_1 = __importDefault(require("magic-string"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const SSR_BUNDLE_NAME = 'index.js';
exports.default = () => {
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
            if ((0, vite_1.normalizePath)(source).includes('/hydrogen/platforms/')) {
                const hydrogenPath = path_1.default.dirname(require.resolve('@shopify/hydrogen/package.json'));
                const platformEntryName = source.split(path_1.default.sep).pop() || '';
                const platformEntryPath = path_1.default.resolve(hydrogenPath, 'dist', 'esnext', 'platforms', platformEntryName);
                return this.resolve(platformEntryPath, importer, {
                    skipSelf: true,
                });
            }
            return null;
        },
        transform(code, id) {
            if ((0, vite_1.normalizePath)(id).includes('/hydrogen/dist/esnext/platforms/')) {
                const ms = new magic_string_1.default(code);
                ms.replace('__SERVER_ENTRY__', vite_plugin_hydrogen_middleware_1.HYDROGEN_DEFAULT_SERVER_ENTRY);
                const indexTemplatePath = (0, vite_1.normalizePath)(path_1.default.resolve(config.root, config.build.outDir, '..', 'client', 'index.html'));
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
                fs_1.default.writeFileSync(path_1.default.join(options.dir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf-8');
            }
        },
    };
};
