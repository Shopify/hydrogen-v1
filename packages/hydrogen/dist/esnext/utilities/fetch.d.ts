declare type FetchInit = {
    body?: string;
    method?: string;
    headers?: Record<string, string>;
};
export declare function fetchBuilder<T>(url: string, options?: FetchInit): () => Promise<T>;
export declare function graphqlRequestBody(query: string, variables?: Record<string, any>): string;
export declare function decodeShopifyId(id: string): string;
export {};
