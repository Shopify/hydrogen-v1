import { Logger } from '../../utilities/log';
import type { HydrogenResponse } from '../HydrogenResponse/HydrogenResponse.server';
import type { HydrogenRequest } from '../HydrogenRequest/HydrogenRequest.server';
export declare type SessionSyncApi = {
    get: () => Record<string, string>;
};
export declare type SessionApi = {
    get: () => Promise<Record<string, string>>;
    set: (key: string, value: string) => Promise<void>;
    destroy: () => Promise<void>;
};
export declare type SessionStorageAdapter = {
    get: (request: Request) => Promise<Record<string, string>>;
    set: (request: Request, value: Record<string, string>) => Promise<string>;
    destroy: (request: Request) => Promise<string>;
};
export declare function getSyncSessionApi(request: HydrogenRequest, componentResponse: HydrogenResponse, log: Logger, session?: SessionStorageAdapter): {
    get(): any;
};
export declare const emptySessionImplementation: (log: Logger) => {
    get(): Promise<{}>;
    set(key: string, value: string): Promise<void>;
    destroy(): Promise<void>;
};
export declare const emptySyncSessionImplementation: (log: Logger) => {
    get(): {};
};
