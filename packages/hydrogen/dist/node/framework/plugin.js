"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const vite_plugin_hydrogen_config_1 = __importDefault(require("./plugins/vite-plugin-hydrogen-config"));
const vite_plugin_hydrogen_middleware_1 = __importDefault(require("./plugins/vite-plugin-hydrogen-middleware"));
const vite_plugin_hydrogen_client_middleware_1 = __importDefault(require("./plugins/vite-plugin-hydrogen-client-middleware"));
const vite_plugin_hydrogen_virtual_files_1 = __importDefault(require("./plugins/vite-plugin-hydrogen-virtual-files"));
const vite_plugin_platform_entry_1 = __importDefault(require("./plugins/vite-plugin-platform-entry"));
const vite_plugin_hydrogen_rsc_1 = __importDefault(require("./plugins/vite-plugin-hydrogen-rsc"));
const vite_plugin_ssr_interop_1 = __importDefault(require("./plugins/vite-plugin-ssr-interop"));
const vite_plugin_purge_query_cache_1 = __importDefault(require("./plugins/vite-plugin-purge-query-cache"));
const vite_plugin_hydration_auto_import_1 = __importDefault(require("./plugins/vite-plugin-hydration-auto-import"));
const vite_plugin_inspect_1 = __importDefault(require("vite-plugin-inspect"));
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const vite_plugin_css_modules_rsc_1 = __importDefault(require("./plugins/vite-plugin-css-modules-rsc"));
const vite_plugin_client_imports_1 = __importDefault(require("./plugins/vite-plugin-client-imports"));
const vite_plugin_hydrogen_suppress_warnings_1 = __importDefault(require("./plugins/vite-plugin-hydrogen-suppress-warnings"));
const hydrogenPlugin = (pluginOptions = {}) => {
    return [
        process.env.VITE_INSPECT && (0, vite_plugin_inspect_1.default)(),
        (0, vite_plugin_hydrogen_config_1.default)(),
        (0, vite_plugin_hydrogen_client_middleware_1.default)(),
        (0, vite_plugin_client_imports_1.default)(),
        (0, vite_plugin_hydrogen_middleware_1.default)(pluginOptions),
        (0, vite_plugin_hydrogen_virtual_files_1.default)(pluginOptions),
        (0, plugin_react_1.default)(),
        (0, vite_plugin_hydration_auto_import_1.default)(),
        (0, vite_plugin_ssr_interop_1.default)(),
        (0, vite_plugin_css_modules_rsc_1.default)(),
        (0, vite_plugin_hydrogen_rsc_1.default)(),
        (0, vite_plugin_platform_entry_1.default)(),
        (0, vite_plugin_hydrogen_suppress_warnings_1.default)(),
        pluginOptions.purgeQueryCacheOnBuild && (0, vite_plugin_purge_query_cache_1.default)(),
    ];
};
exports.default = hydrogenPlugin; // For ESM
module.exports = hydrogenPlugin;
