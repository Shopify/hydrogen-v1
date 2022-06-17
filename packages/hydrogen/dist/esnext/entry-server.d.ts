import type { RequestHandler } from './types';
declare global {
    var __HYDROGEN_WORKER__: boolean;
}
export declare const renderHydrogen: (App: any) => RequestHandler;
export default renderHydrogen;
