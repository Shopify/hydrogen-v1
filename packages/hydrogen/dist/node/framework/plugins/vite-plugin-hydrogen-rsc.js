"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const plugin_js_1 = __importDefault(require("@shopify/hydrogen/vendor/react-server-dom-vite/plugin.js"));
const vite_plugin_hydrogen_middleware_1 = require("./vite-plugin-hydrogen-middleware");
const vite_plugin_hydrogen_virtual_files_1 = require("./vite-plugin-hydrogen-virtual-files");
function default_1() {
    return (0, plugin_js_1.default)({
        serverBuildEntries: [
            vite_plugin_hydrogen_middleware_1.HYDROGEN_DEFAULT_SERVER_ENTRY,
            vite_plugin_hydrogen_virtual_files_1.VIRTUAL_PROXY_HYDROGEN_ROUTES_ID,
        ],
        isServerComponentImporterAllowed(importer, source) {
            return (
            // Always allow the entry server (e.g. App.server.jsx) to be imported
            // in other files such as worker.js or server.js.
            source.includes(vite_plugin_hydrogen_middleware_1.HYDROGEN_DEFAULT_SERVER_ENTRY) ||
                /(index|entry-server|hydrogen\.config)\.[jt]s/.test(importer) ||
                // Support importing server components for testing
                // TODO: revisit this when RSC splits into two bundles
                /\.test\.[tj]sx?$/.test(importer));
        },
    });
}
exports.default = default_1;
