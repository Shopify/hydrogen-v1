import { HydrogenRequest } from '../../foundation/HydrogenRequest/HydrogenRequest.server';
import { HydrogenResponse } from '../../foundation/HydrogenResponse/HydrogenResponse.server';
import { QueryKey } from '../../types';
import type { RenderType } from './log';
export declare type QueryCacheControlHeaders = {
    name: string;
    header: string | null;
};
export declare function collectQueryCacheControlHeaders(request: HydrogenRequest, queryKey: QueryKey, cacheControlHeader: string | null): void;
export declare function logCacheControlHeaders(type: RenderType, request: HydrogenRequest, response?: HydrogenResponse): void;
