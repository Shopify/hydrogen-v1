/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'http';
export interface RuntimeContext {
    waitUntil: (fn: Promise<any>) => void;
}
export interface RequestHandlerOptions {
    indexTemplate: string | ((url: string) => Promise<string | {
        default: string;
    }>);
    cache?: Cache;
    streamableResponse?: ServerResponse;
    dev?: boolean;
    context?: RuntimeContext;
    nonce?: string;
    buyerIpHeader?: string;
}
export interface RequestHandler {
    (request: Request | IncomingMessage, options: RequestHandlerOptions): Promise<Response | undefined>;
}
export declare type ShopifyConfig = {
    defaultLocale?: string;
    storeDomain: string;
    storefrontToken: string;
    storefrontApiVersion: string;
    multipassSecret?: string;
};
