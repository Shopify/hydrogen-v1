"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_plugin_hydrogen_middleware_1 = require("./vite-plugin-hydrogen-middleware");
const magic_string_1 = __importDefault(require("magic-string"));
const path_1 = __importDefault(require("path"));
const cssModuleRE = /\.module\.(s?css|sass|less|stylus)/;
function cssModulesRsc() {
    // 1. Original CSS module: `.myStyle { color: red; }`
    // 2. CSS module after 'pre' Vite transforms: `.myStyle_hashedXYZ { color: red; }`
    // 3. CSS module after 'post' Vite transforms: `export const myStyle = 'myStyle_hashedXYZ';`
    let cssMap = new Map();
    let config;
    return [
        {
            name: 'css-modules-rsc',
            configResolved(_config) {
                config = _config;
                cssMap = new Map();
                // Place this plugin before react-refresh to
                // modify files before JSX is compiled.
                // @ts-ignore
                config.plugins.unshift(autoStyleTagPlugin());
            },
            transform(code, id) {
                if (cssModuleRE.test(id)) {
                    cssMap.set(id, code);
                }
            },
        },
        {
            name: 'css-modules-rsc-post',
            enforce: 'post',
            transform(code, id) {
                if (id.includes('.module.') && cssMap.has(id)) {
                    const isDev = config.command === 'serve';
                    const key = path_1.default.relative(config.root, id.split('?')[0]);
                    const s = new magic_string_1.default(code);
                    s.prepend((isDev
                        ? `import {jsxDEV as _jsx} from 'react/jsx-dev-runtime';`
                        : `import {jsx as _jsx} from 'react/jsx-runtime';`) +
                        `export const StyleTag = () => _jsx('style', {dangerouslySetInnerHTML: {__html: ${JSON.stringify(cssMap.get(id))}}});` +
                        `\nStyleTag.key = '${key}';\n`);
                    s.replace(/export default \{/gs, `export default {\n  StyleTag,`);
                    return {
                        code: s.toString(),
                        map: s.generateMap({ file: id, source: id }),
                    };
                }
            },
        },
    ];
}
exports.default = cssModulesRsc;
function autoStyleTagPlugin() {
    return {
        name: 'css-modules-auto-style-tag',
        transform(code, id) {
            id = id.split('?')[0];
            if (/\.[jt]sx$/.test(id) &&
                !id.endsWith(vite_plugin_hydrogen_middleware_1.HYDROGEN_DEFAULT_SERVER_ENTRY) &&
                !id.endsWith(path_1.default.format({
                    name: vite_plugin_hydrogen_middleware_1.HYDROGEN_DEFAULT_SERVER_ENTRY,
                    ext: path_1.default.extname(id),
                })) &&
                cssModuleRE.test(code) &&
                code.includes('export default')) {
                const s = new magic_string_1.default(code);
                // 1. Gather style tags in an array
                let styleCount = 0;
                s.prepend(`const __styleTags = [];\n`);
                s.replace(/^import\s+(.+?)\s+from\s+['"]([^'"]+?\.module\.[^'"]+?)['"]/gm, (all, statements, from) => {
                    if (!cssModuleRE.test(from)) {
                        return all;
                    }
                    if (statements.startsWith('{')) {
                        // Add default import
                        const replacement = `__style${styleCount++}, {`;
                        statements = statements.replace('{', replacement);
                        all = all.replace('{', replacement);
                    }
                    const defaultImport = statements
                        .split(',')[0]
                        .replace(/\*\s+as\s+/, '')
                        .trim();
                    return all + `; __styleTags.push(${defaultImport}.StyleTag)`;
                });
                // 2. Wrap default export in a new component that includes the style tags
                s.replace(/export default/gm, 'const __defaultExport = ');
                s.append(`\nconst __ApplyStyleTags = function (props) {\n` +
                    `  return <>{__styleTags.map(ST => <ST key={ST.key} />)}<__defaultExport {...props} /></>;` +
                    `\n}\n\n` +
                    `Object.defineProperty(__ApplyStyleTags, 'name', {value: 'ApplyStyleTags_' + (__defaultExport.name || '')});\n` +
                    `export default __ApplyStyleTags;`);
                return {
                    code: s.toString(),
                    map: s.generateMap({ file: id, source: id }),
                };
            }
        },
    };
}
