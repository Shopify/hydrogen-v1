import type {HydrogenVitePluginOptions} from './types';
import hydrogenConfig from './plugins/vite-plugin-hydrogen-config';
import type {Plugin} from 'vite';
import hydrogenMiddleware from './plugins/vite-plugin-hydrogen-middleware';
import hydrogenClientMiddleware from './plugins/vite-plugin-hydrogen-client-middleware';
import hydrogenVirtualFiles from './plugins/vite-plugin-hydrogen-virtual-files';
import platformEntry from './plugins/vite-plugin-platform-entry';
import rsc from './plugins/vite-plugin-hydrogen-rsc';
import ssrInterop from './plugins/vite-plugin-ssr-interop';
import purgeQueryCache from './plugins/vite-plugin-purge-query-cache';
import hydrationAutoImport from './plugins/vite-plugin-hydration-auto-import';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react';
import cssRsc from './plugins/vite-plugin-css-rsc';
import cssModulesRsc from './plugins/vite-plugin-css-modules-rsc';
import clientImports from './plugins/vite-plugin-client-imports';
import suppressWarnings from './plugins/vite-plugin-hydrogen-suppress-warnings';

const hydrogenPlugin = (pluginOptions: HydrogenVitePluginOptions = {}) => {
  return [
    process.env.VITE_INSPECT && inspect(),
    hydrogenConfig(),
    hydrogenClientMiddleware(),
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
    pluginOptions.purgeQueryCacheOnBuild && purgeQueryCache(),
  ] as Plugin[];
};

// @ts-ignore
export = hydrogenPlugin; // TS syntax to support CJS interop
export default hydrogenPlugin; // For ESM
