import type {ServerResponse} from 'http';
import type {ServerComponentResponse} from './framework/Hydration/ServerComponentResponse.server';
import type {ServerComponentRequest} from './framework/Hydration/ServerComponentRequest.server';
import type {Metafield} from './graphql/types/types';

export type Renderer = (
  url: URL,
  options: {
    request: ServerComponentRequest;
    context?: Record<string, any>;
    isReactHydrationRequest?: boolean;
    dev?: boolean;
  }
) => Promise<
  {
    body: string;
    componentResponse: ServerComponentResponse;
  } & Record<string, any>
>;

export type Streamer = (
  url: URL,
  options: {
    context: any;
    request: ServerComponentRequest;
    response: ServerResponse;
    template: string;
    dev?: boolean;
  }
) => void;

export type Hydrator = (
  url: URL,
  options: {
    context: any;
    request: ServerComponentRequest;
    response: ServerResponse;
    dev?: boolean;
  }
) => void;

export type EntryServerHandler = {
  render: Renderer;
  stream: Streamer;
  hydrate: Hydrator;
};

export type ShopifyConfig = {
  locale?: string;
  storeDomain: string;
  storefrontToken: string;
  graphqlApiVersion?: string;
};

export type Hook = (
  params: {url: URL} & Record<string, any>
) => any | Promise<any>;

export type ServerHandler = (
  App: any,
  hook?: Hook
) => {
  render: Renderer;
  stream: Streamer;
  hydrate: Hydrator;
};

export type ClientHandler = (App: any, hook?: Hook) => Promise<void>;

export interface GraphQLConnection<T> {
  edges?: {node: T}[];
}

export type RawMetafield = Partial<Metafield>;
export type ParsedMetafield = Omit<Partial<Metafield>, 'value'> & {
  value?:
    | string
    | number
    | boolean
    | Record<any, string>
    | Date
    | Rating
    | Measurement;
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

export interface CacheOptions {
  private?: boolean;
  maxAge?: number;
  staleWhileRevalidate?: number;
  noStore?: boolean;
}

export interface HydrogenVitePluginOptions {
  devCache?: boolean;
}
