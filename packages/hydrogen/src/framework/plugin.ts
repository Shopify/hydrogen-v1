import type {HydrogenVitePluginOptions} from './types.js';
import hydrogenConfig from './plugins/vite-plugin-hydrogen-config.js';
import type {Plugin} from 'vite';
import hydrogenMiddleware from './plugins/vite-plugin-hydrogen-middleware.js';
import hydrogenClientComponentsCache from './plugins/vite-plugin-hydrogen-client-components-cache.js';
import hydrogenVirtualFiles from './plugins/vite-plugin-hydrogen-virtual-files.js';
import platformEntry from './plugins/vite-plugin-platform-entry.js';
import rsc from './plugins/vite-plugin-hydrogen-rsc.js';
import ssrInterop from './plugins/vite-plugin-ssr-interop.js';
import hydrationAutoImport from './plugins/vite-plugin-hydration-auto-import.js';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react';
import cssRsc from './plugins/vite-plugin-css-rsc.js';
import cssModulesRsc from './plugins/vite-plugin-css-modules-rsc.js';
import clientImports from './plugins/vite-plugin-client-imports.js';
import suppressWarnings from './plugins/vite-plugin-hydrogen-suppress-warnings.js';
import assetsVersion from './plugins/vite-plugin-assets-version.js';

const hydrogenPlugin = (pluginOptions: HydrogenVitePluginOptions = {}) => {
  return [
    process.env.VITE_INSPECT && inspect(),
    hydrogenConfig(pluginOptions),
    hydrogenClientComponentsCache(),
    clientImports(),
    hydrogenMiddleware(pluginOptions),
    hydrogenVirtualFiles(pluginOptions),
    react(),
    hydrationAutoImport(),
    ssrInterop(),
    pluginOptions.experimental?.css === 'global' ? cssRsc() : cssModulesRsc(),
    rsc(pluginOptions),
    platformEntry(),
    suppressWarnings(),
    pluginOptions.assetHashVersion &&
      assetsVersion(pluginOptions.assetHashVersion),
  ] as Plugin[];
};

// @ts-ignore
export = hydrogenPlugin; // TS syntax to support CJS interop
export default hydrogenPlugin; // For ESM
