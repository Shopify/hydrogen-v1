// These types are shared in ESM and CJS builds.
// Do not import anything from subfolders here to avoid
// affecting the files generated in the CJS build.

import type {IncomingMessage, ServerResponse} from 'http';

export interface RuntimeContext {
  waitUntil: (fn: Promise<any>) => void;
}

export interface RequestHandlerOptions {
  indexTemplate:
    | string
    | ((url: string) => Promise<string | {default: string}>);
  cache?: Cache;
  streamableResponse?: ServerResponse;
  dev?: boolean;
  context?: RuntimeContext;
  nonce?: string;
  buyerIpHeader?: string;
}

export interface RequestHandler {
  (request: Request | IncomingMessage, options: RequestHandlerOptions): Promise<
    Response | undefined
  >;
}

export type ShopifyConfig = {
  defaultLanguageCode?: string;
  defaultCountryCode?: string;
  storeDomain: string;
  storefrontToken: string;
  storefrontApiVersion: string;
  multipassSecret?: string;
};
