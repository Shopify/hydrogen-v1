import { loadScript } from '../../utilities/load_script';
declare type LoadScriptParams = Parameters<typeof loadScript>;
/**
 * The `useLoadScript` hook loads an external script tag on the client-side.
 */
export declare function useLoadScript(url: LoadScriptParams[0], options?: LoadScriptParams[1]): ScriptState;
declare type ScriptState = 'loading' | 'done' | 'error';
export {};
