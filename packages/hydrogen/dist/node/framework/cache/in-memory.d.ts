/**
 * This is an in-memory implementation of `Cache` that *barely*
 * works and is only meant to be used during development.
 */
export declare class InMemoryCache {
    private store;
    constructor();
    put(request: Request, response: Response): void;
    match(request: Request): Response | undefined;
    delete(request: Request): void;
    keys(request?: Request): Promise<Request[]>;
}
