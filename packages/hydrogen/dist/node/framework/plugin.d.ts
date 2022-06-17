import type { HydrogenVitePluginOptions } from './types';
import type { Plugin } from 'vite';
declare const hydrogenPlugin: (pluginOptions?: HydrogenVitePluginOptions) => Plugin[];
export = hydrogenPlugin;
export default hydrogenPlugin;
