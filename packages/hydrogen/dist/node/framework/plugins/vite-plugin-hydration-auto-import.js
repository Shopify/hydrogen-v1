"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const path_1 = __importDefault(require("path"));
const magic_string_1 = __importDefault(require("magic-string"));
const HYDROGEN_ENTRY_FILE = 'hydrogen-entry-client.jsx';
exports.default = () => {
    let config;
    return {
        name: 'vite-plugin-hydration-auto-import',
        enforce: 'pre',
        configResolved(_config) {
            config = _config;
        },
        resolveId(id, importer) {
            if ((/^\/?@shopify\/hydrogen\/entry-client$/.test(id) ||
                id.endsWith(path_1.default.sep + HYDROGEN_ENTRY_FILE)) &&
                (0, vite_1.normalizePath)(importer || '').endsWith('/index.html')) {
                // Make this virtual import look like a local project file
                // to enable React Refresh normally.
                return path_1.default.join(config.root, HYDROGEN_ENTRY_FILE + '?virtual');
            }
            return null;
        },
        load(id) {
            if (id.includes(HYDROGEN_ENTRY_FILE + '?virtual')) {
                const code = new magic_string_1.default(`import renderHydrogen from '@shopify/hydrogen/entry-client';\n` +
                    `export default renderHydrogen((props) => props.children);`);
                return {
                    code: code.toString(),
                    map: { mappings: '' },
                };
            }
            return null;
        },
    };
};
