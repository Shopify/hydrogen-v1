import type {ServerResponse} from 'http';
import type {Logger} from './utilities/log/log';
import type {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import type {ServerComponentResponse} from './framework/Hydration/ServerComponentResponse.server';
import type {
  Metafield,
  ProductVariant,
  Product,
  MediaImage,
} from './storefront-api-types';

type CommonOptions = {
  App: any;
  routes?: ImportGlobEagerOutput;
  request: ServerComponentRequest;
  componentResponse: ServerComponentResponse;
  log: Logger;
  dev?: boolean;
};

export type RendererOptions = CommonOptions & {
  template: string;
  nonce?: string;
};

export type StreamerOptions = CommonOptions & {
  response?: ServerResponse;
  template: string;
  nonce?: string;
};

export type HydratorOptions = CommonOptions & {
  response?: ServerResponse;
  isStreamable: boolean;
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

export type ServerHandlerConfig = {
  routes?: ImportGlobEagerOutput;
  shopifyConfig: ShopifyConfig;
};

export type ClientHandlerConfig = {
  shopifyConfig: ShopifyConfig;
  /** React's StrictMode is on by default for your client side app; if you want to turn it off (not recommended), you can pass `false` */
  strictMode?: boolean;
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
}

export type PreloadOptions = boolean | string;
