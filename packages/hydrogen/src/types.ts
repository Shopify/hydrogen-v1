import type {ServerResponse} from 'http';
import type {Logger, LoggerConfig} from './utilities/log/log';
import type {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import type {ServerComponentResponse} from './framework/Hydration/ServerComponentResponse.server';
import type {
  Metafield,
  ProductVariant,
  Product,
  MediaImage,
} from './storefront-api-types';
import type {SessionStorageAdapter} from './foundation/session/session';

export type AssembleHtmlParams = {
  ssrHtml: string;
  rscPayload?: string;
  routes?: ImportGlobEagerOutput;
  request: ServerComponentRequest;
  template: string;
};

export type RunSsrParams = {
  state: Record<string, any>;
  rsc: {readable: ReadableStream; didError: () => Error | undefined};
  routes?: ImportGlobEagerOutput;
  request: ServerComponentRequest;
  response: ServerComponentResponse;
  log: Logger;
  dev?: boolean;
  template: string;
  nonce?: string;
  nodeResponse?: ServerResponse;
};

export type RunRscParams = {
  App: any;
  state: Record<string, any>;
  log: Logger;
  request: ServerComponentRequest;
  response: ServerComponentResponse;
};

export type ShopifyConfig = {
  defaultLocale?: string;
  storeDomain: string;
  storefrontToken: string;
  storefrontApiVersion: string;
};

export type Hook = (
  params: {url: URL} & Record<string, any>
) => any | Promise<any>;

export type ImportGlobEagerOutput = Record<
  string,
  Record<'default' | 'api', any>
>;

export type InlineHydrogenRoutes =
  | string
  | {
      files: string;
      basePath?: string;
    };

export type ResolvedHydrogenRoutes = {
  files: ImportGlobEagerOutput;
  dirPrefix: string;
  basePath: string;
};

type ConfigFetcher<T> = (request: ServerComponentRequest) => T | Promise<T>;

export type ShopifyConfigFetcher = ConfigFetcher<ShopifyConfig>;

export type ServerAnalyticsConnector = {
  request: (
    request: Request,
    data?: any,
    contentType?: 'json' | 'text'
  ) => void;
};

export type InlineHydrogenConfig = {
  routes?: InlineHydrogenRoutes;
  shopify?: ShopifyConfig | ShopifyConfigFetcher;
  serverAnalyticsConnectors?: Array<ServerAnalyticsConnector>;
  logger?: LoggerConfig;
  session?: (log: Logger) => SessionStorageAdapter;
  enableStreaming?: (request: ServerComponentRequest) => boolean;
};

export type ResolvedHydrogenConfig = Omit<InlineHydrogenConfig, 'routes'> & {
  routes: ResolvedHydrogenRoutes;
};

export type ClientHandlerConfig = {
  /** React's StrictMode is on by default for your client side app; if you want to turn it off (not recommended), you can pass `false` */
  strictMode?: boolean;
  showDevTools?: boolean;
};

export type ClientHandler = (
  App: React.ElementType,
  config: ClientHandlerConfig
) => Promise<void>;

export interface GraphQLConnection<T> {
  edges?: {node: T}[];
}

export type ParsedMetafield = Omit<
  Partial<Metafield>,
  'value' | 'reference'
> & {
  value?:
    | string
    | number
    | boolean
    | Record<any, string>
    | Date
    | Rating
    | Measurement;
  reference?: MediaImage | ProductVariant | Product | null;
};

export interface Rating {
  value: number;
  scale_min: number;
  scale_max: number;
}

export interface Measurement {
  unit: string;
  value: number;
}

export type QueryKey = string | readonly unknown[];

export type NoStoreStrategy = {
  mode: string;
};

export interface AllCacheOptions {
  mode?: string;
  maxAge?: number;
  staleWhileRevalidate?: number;
  sMaxAge?: number;
  staleIfError?: number;
}

export type CachingStrategy = AllCacheOptions;

export interface HydrogenVitePluginOptions {
  devCache?: boolean;
  purgeQueryCacheOnBuild?: boolean;
  configPath?: string;
}

export type PreloadOptions = boolean | string;
