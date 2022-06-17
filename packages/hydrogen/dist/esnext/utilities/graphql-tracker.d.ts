import type { ASTNode } from 'graphql';
export declare const TIMEOUT_MS = 2000;
declare type TrackerParams = {
    query: ASTNode | string;
    data: {
        data: unknown;
    };
    onUnusedData?: (params: {
        queryName: string;
        properties: string[];
    }) => void;
};
export declare function injectGraphQLTracker({ query, data, onUnusedData, }: TrackerParams): (check?: (params: {
    queryName: string;
    properties: string[];
}) => void) => void;
export {};
