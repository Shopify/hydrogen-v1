import {ServerResponse} from 'http';
import type {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import type {Metafield, Image, MediaContentType} from './graphql/types/types';
import {ApiRouteMatch} from './utilities/apiRoutes';
import {Logger} from './utilities/log/log';

export type Renderer = (
  url: URL,
  options: {
    request: ServerComponentRequest;
    template: string;
    nonce?: string;
    dev?: boolean;
  }
) => Promise<Response>;

export type Streamer = (
  url: URL,
  options: {
    request: ServerComponentRequest;
    response?: ServerResponse;
    template: string;
    nonce?: string;
    dev?: boolean;
  }
) => void;

export type Hydrator = (
  url: URL,
  options: {
    request: ServerComponentRequest;
    response?: ServerResponse;
    isStreamable: boolean;
    dev?: boolean;
  }
) => void;

export type EntryServerHandler = {
  render: Renderer;
  stream: Streamer;
  hydrate: Hydrator;
  getApiRoute: (url: URL) => ApiRouteMatch | null;
  log: Logger;
};

export type ShopifyConfig = {
  defaultLocale?: string;
  storeDomain: string;
  storefrontToken: string;
  graphqlApiVersion?: string;
};

export type Hook = (
  params: {url: URL} & Record<string, any>
) => any | Promise<any>;

export type ImportGlobEagerOutput = Record<
  string,
  Record<'default' | 'api', any>
>;

export type ServerHandlerConfig = {
  pages?: ImportGlobEagerOutput;
  shopifyConfig: ShopifyConfig;
};

export type ClientHandlerConfig = {
  shopifyConfig: ShopifyConfig;
};

export type ServerHandler = (
  App: any,
  config: ServerHandlerConfig
) => EntryServerHandler;

export type ClientHandler = (
  App: any,
  config: ClientHandlerConfig
) => Promise<void>;

export interface GraphQLConnection<T> {
  edges?: {node: T}[];
}

export interface MediaImage {
  __typename?: string;
  id?: string;
  mediaContentType?: MediaContentType;
  image?: Pick<Image, 'altText' | 'url' | 'id' | 'width' | 'height'>;
}

interface ProductVariant {
  __typename?: string;
}

interface Product {
  __typename?: string;
}

export type RawMetafield = Omit<Partial<Metafield>, 'reference'> & {
  reference?: MediaImage | ProductVariant | Product | null;
};

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

export interface CacheOptions {
  private?: boolean;
  maxAge?: number;
  staleWhileRevalidate?: number;
  noStore?: boolean;
}

export interface HydrogenVitePluginOptions {
  devCache?: boolean;
  purgeQueryCacheOnBuild?: boolean;
}
