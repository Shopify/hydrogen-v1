import type {ShopifyContextValue} from '../../foundation/ShopifyProvider/types';
import {getTime} from '../../utilities/timing';
import type {QueryCacheControlHeaders} from '../../utilities/log/log-cache-header';
import type {QueryTiming} from '../../utilities/log/log-query-timeline';
import type {QueryKey} from '../../types';
import {ServerComponentResponse} from './ServerComponentResponse.server';
import {hashKey} from '../cache';
import {HelmetData as HeadData} from 'react-helmet-async';

export type PreloadQuery = {
  key: QueryKey;
  fetcher: () => Promise<unknown>;
  preload?: boolean | string | Array<string>;
};

export type PreloadQueries = Map<string, PreloadQuery>;

export type PreloadSetQueries = {
  queries: PreloadQueries;
  setName?: string;
};

export type PreloadSetQueriesMap = Map<string, PreloadSetQueries>;

let reqCounter = 0; // For debugging
const generateId =
  typeof crypto !== 'undefined' &&
  // @ts-ignore
  !!crypto.randomUUID
    ? // @ts-ignore
      () => crypto.randomUUID() as string
    : () => `req${++reqCounter}`;

// Stores queries by url
// <url, Map<hashkey(QueryKey), fetcher>
const preloadCache: PreloadSetQueriesMap = new Map();

// Stores queries by preload set
// <'product', Map<hashkey(QueryKey), fetcher>
const preloadSetCache: PreloadSetQueriesMap = new Map();

/**
 * This augments the `Request` object from the Fetch API:
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request
 *
 * - Adds a `cookies` map for easy access
 * - Adds a static constructor to convert a Node.js `IncomingMessage` to a Request.
 */
export class ServerComponentRequest extends Request {
  public cookies: Map<string, string>;
  public id: string;
  public time: number;
  public originalUrl: string;
  // CFW Request has a reserved 'context' property, use 'ctx' instead.
  public ctx: {
    cache: Map<string, any>;
    head: HeadData;
    shopifyConfig?: ShopifyContextValue;
    queryCacheControl: Array<QueryCacheControlHeaders>;
    queryTimings: Array<QueryTiming>;
    preloadQueries: PreloadQueries;
    [key: string]: any;
  };

  constructor(input: any);
  constructor(input: RequestInfo, init?: RequestInit);
  constructor(input: RequestInfo | any, init?: RequestInit) {
    if (input instanceof Request) {
      super(input, init);
    } else {
      super(getUrlFromNodeRequest(input), {
        headers: new Headers(input.headers as {[key: string]: string}),
        method: input.method,
        body:
          input.method !== 'GET' && input.method !== 'HEAD'
            ? input.body
            : undefined,
      });
    }

    this.time = getTime();
    this.id = generateId();

    this.ctx = {
      cache: new Map(),
      head: new HeadData({}),
      queryCacheControl: [],
      queryTimings: [],
      preloadQueries: new Map(),
    };
    this.cookies = this.parseCookies();
    this.originalUrl = this.headers.get('shopify-original-url') || this.url;
  }

  private parseCookies() {
    const cookieString = this.headers.get('cookie') || '';

    return new Map(
      cookieString
        .split(';')
        .map((chunk) => chunk.trim().split(/=(.+)/) as [string, string])
    );
  }

  public savePreloadQuery(query: PreloadQuery) {
    if (typeof query.preload === 'string') {
      saveToPreloadSetQueries(query.preload, query);
    } else if (query.preload instanceof Array) {
      query.preload.forEach((preloadSet) => {
        saveToPreloadSetQueries(preloadSet, query);
      });
    } else {
      this.ctx.preloadQueries.set(hashKey(query.key), query);
    }
  }

  public getPreloadQueries(): PreloadQueries | undefined {
    if (preloadCache.has(this.originalUrl)) {
      let combinedPreloadQueries: PreloadQueries = new Map();
      const urlCache = preloadCache.get(this.originalUrl);

      mergeMapEntries(combinedPreloadQueries, urlCache?.queries);
      mergeMapEntries(
        combinedPreloadQueries,
        preloadSetCache.get('*')?.queries
      );

      if (urlCache?.setName) {
        mergeMapEntries(
          combinedPreloadQueries,
          preloadSetCache.get(urlCache?.setName)?.queries
        );
      }

      return combinedPreloadQueries;
    } else if (preloadSetCache.has('*')) {
      return preloadSetCache.get('*')?.queries;
    }
  }

  public savePreloadQueries(response: ServerComponentResponse) {
    preloadCache.set(this.originalUrl, {
      setName: response.preloadSet,
      queries: this.ctx.preloadQueries,
    });
  }
}

function mergeMapEntries(
  map1: PreloadQueries,
  map2: PreloadQueries | undefined
) {
  map2 && map2.forEach((v, k) => map1.set(k, v));
}

function saveToPreloadSetQueries(preloadSet: string, query: PreloadQuery) {
  let setCache = preloadSetCache.get(preloadSet)?.queries;
  if (!setCache) {
    setCache = new Map();
  }
  setCache?.set(hashKey(query.key), query);
  preloadSetCache.set(preloadSet, {
    queries: setCache,
  });
}

/**
 * @see https://github.com/frandiox/vitedge/blob/17f3cd943e86d7c0c71a862985ddd6caa2899425/src/node/utils.js#L19-L24
 *
 * Note: Request can sometimes be an instance of Express request, where `originalUrl` is the true source of what the
 * URL pathname is. We want to use that if it's present, so we union type this to `any`.
 */
function getUrlFromNodeRequest(request: any) {
  // TODO: Find out how to determine https from `request` object without forwarded proto
  const secure = request.headers['x-forwarded-proto'] === 'https';

  return new URL(
    `${secure ? 'https' : 'http'}://${
      request.headers.host! + (request.originalUrl ?? request.url)
    }`
  ).toString();
}
