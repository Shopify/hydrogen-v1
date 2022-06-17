import { Plugin } from 'vite';
import type { HydrogenVitePluginOptions } from '../types';
export declare const HYDROGEN_DEFAULT_SERVER_ENTRY: string;
declare const _default: (pluginOptions: HydrogenVitePluginOptions) => Plugin;
export default _default;
declare global {
    var Oxygen: {
        env: any;
        [key: string]: any;
    };
}
