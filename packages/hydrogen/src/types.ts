import type {RequestOptions, ServerResponse} from 'http';
import type {Logger} from './utilities/log/log';
import type {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import type {ServerComponentResponse} from './framework/Hydration/ServerComponentResponse.server';
import type {Metafield, Image, MediaContentType} from './graphql/types/types';
import type {ServerState} from '.';

type CommonOptions = {
  App: any;
  pages?: ImportGlobEagerOutput;
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
  pages?: ImportGlobEagerOutput;
  shopifyConfig: ShopifyConfig;
};

export type ClientHandlerConfig = {
  shopifyConfig: ShopifyConfig;
};

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
  data?: Pick<Image, 'altText' | 'url' | 'id' | 'width' | 'height'>;
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

export type CachingStrategy = NoStoreStrategy | AllCacheOptions;

export interface HydrogenVitePluginOptions {
  devCache?: boolean;
  purgeQueryCacheOnBuild?: boolean;
}
type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
  [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

export type HydrogenAPIRoute = (
  request: Request,
  options: RequestOptions
) => Promise<Response | string | JSONObject>;

export type HydrogenPageProps = ServerState & {
  params: Record<string, any>;
  request: ServerComponentRequest;
  response: ServerComponentResponse;
};

export type HydrogenPage = (props: HydrogenPageProps) => JSX.Element;
