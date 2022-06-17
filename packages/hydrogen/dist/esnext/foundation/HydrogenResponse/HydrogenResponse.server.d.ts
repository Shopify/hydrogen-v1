import type { CachingStrategy } from '../../types';
import React from 'react';
export declare class HydrogenResponse extends Response {
    private wait;
    private cacheOptions;
    private proxy;
    status: number;
    statusText: string;
    constructor(...args: ConstructorParameters<typeof Response>);
    /**
     * Buffer the current response until all queries have resolved,
     * and prevent it from streaming back early.
     */
    doNotStream(): void;
    canStream(): boolean;
    cache(options?: CachingStrategy): import("../../types").AllCacheOptions;
    get cacheControlHeader(): string;
    redirect(location: string, status?: number): React.FunctionComponentElement<{
        to: string;
    }>;
}
