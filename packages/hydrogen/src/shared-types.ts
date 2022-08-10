// These types are shared in ESM and CJS builds.
// Do not import anything from subfolders here to avoid
// affecting the files generated in the CJS build.

import type {IncomingMessage, ServerResponse} from 'http';
import type {SessionStorageAdapter} from './foundation/session/session-types';

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
  sessionApi?: SessionStorageAdapter;
  headers?: Headers;
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

export type InlineHydrogenRoutes =
  | string
  | {
      files: string;
      basePath?: string;
    };

export type HydrogenPluginOptions = {
  [key: string]: any;
};

export type GenericEventHandler = (payload: any) => void | Promise<void>;

export type HydrogenEventPrefix = `query:${string}` | `mutation:${string}`;

export type HydrogenEventName = 'pageView' | 'addToCart';

export type HydrogenEvents = Partial<
  Record<HydrogenEventName, GenericEventHandler>
> & {
  query?: Record<string, GenericEventHandler>;
  mutation?: Record<string, GenericEventHandler>;
  custom?: Record<string, GenericEventHandler>;
};

export type HydrogenPlugin = {
  name: string;
  url?: string;
  routes?: InlineHydrogenRoutes;
  context?: Record<string, any>;
  middleware?: string;
  events?: HydrogenEvents;
};
