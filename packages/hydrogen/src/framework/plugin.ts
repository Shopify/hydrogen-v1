import type {HydrogenVitePluginOptions} from '../types';
import hydrogenConfig from './plugins/vite-plugin-hydrogen-config';
import type {Plugin} from 'vite';
import hydrogenMiddleware from './plugins/vite-plugin-hydrogen-middleware';
import hydrogenClientMiddleware from './plugins/vite-plugin-hydrogen-client-middleware';
import platformEntry from './plugins/vite-plugin-platform-entry';
import rsc from './plugins/vite-plugin-hydrogen-rsc';
import ssrInterop from './plugins/vite-plugin-ssr-interop';
import purgeQueryCache from './plugins/vite-plugin-purge-query-cache';
import hydrationAutoImport from './plugins/vite-plugin-hydration-auto-import';
import inspect from 'vite-plugin-inspect';
import react from '@vitejs/plugin-react';
import cssModulesRsc from './plugins/vite-plugin-css-modules-rsc';

export default (pluginOptions: HydrogenVitePluginOptions = {}) => {
  return [
    process.env.VITE_INSPECT && inspect(),
    hydrogenConfig(),
    hydrogenClientMiddleware(),
    hydrogenMiddleware(pluginOptions),
    react(),
    hydrationAutoImport(),
    ssrInterop(),
    cssModulesRsc(),
    rsc(),
    platformEntry(),
    pluginOptions.purgeQueryCacheOnBuild && purgeQueryCache(),
  ] as Plugin[];
};
