import type { ShopifyConfig } from '../shared-types';
import type { IncomingMessage, NextFunction } from 'connect';
import type { ServerResponse } from 'http';
import type { ViteDevServer } from 'vite';
declare type HydrogenMiddlewareArgs = {
    dev?: boolean;
    indexTemplate: string | ((url: string) => Promise<string>);
    getServerEntrypoint: () => any;
    devServer?: ViteDevServer;
    cache?: Cache;
};
export declare function graphiqlMiddleware({ getShopifyConfig, dev, }: {
    getShopifyConfig: (request: IncomingMessage) => ShopifyConfig | Promise<ShopifyConfig>;
    dev?: boolean;
}): (request: IncomingMessage, response: ServerResponse, next: NextFunction) => Promise<void>;
/**
 * Provides middleware to Node.js Express-like servers. Used by the Hydrogen
 * Vite dev server plugin as well as production Node.js implementation.
 */
export declare function hydrogenMiddleware({ dev, cache, indexTemplate, getServerEntrypoint, devServer, }: HydrogenMiddlewareArgs): (request: IncomingMessage, response: ServerResponse, next: NextFunction) => Promise<void>;
export {};
