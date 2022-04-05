import type {ShopifyContextValue} from '../../foundation/ShopifyProvider/types';
import {getTime} from '../../utilities/timing';
import type {QueryCacheControlHeaders} from '../../utilities/log/log-cache-header';
import type {QueryTiming} from '../../utilities/log/log-query-timeline';
import type {PreloadOptions, QueryKey} from '../../types';
import {hashKey} from '../cache';
import {HelmetData as HeadData} from 'react-helmet-async';
import {RSC_PATHNAME} from '../../constants';

export type PreloadQueryEntry = {
  key: QueryKey;
  fetcher: () => Promise<unknown>;
  preload?: PreloadOptions;
};
export type PreloadQueriesByURL = Map<string, PreloadQueryEntry>;
export type AllPreloadQueries = Map<string, PreloadQueriesByURL>;
export type RouterContextData = {
  routeRendered: boolean;
  serverProps: Record<string, any>;
  routeParams: Record<string, string>;
};

let reqCounter = 0; // For debugging
const generateId =
  typeof crypto !== 'undefined' &&
  // @ts-ignore
  !!crypto.randomUUID
    ? // @ts-ignore
      () => crypto.randomUUID() as string
    : () => `req${++reqCounter}`;

// Stores queries by url or '*'
const preloadCache: AllPreloadQueries = new Map();
const PRELOAD_ALL = '*';

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
  public preloadURL: string;
  // CFW Request has a reserved 'context' property, use 'ctx' instead.
  public ctx: {
    cache: Map<string, any>;
    head: HeadData;
    shopifyConfig?: ShopifyContextValue;
    queryCacheControl: Array<QueryCacheControlHeaders>;
    queryTimings: Array<QueryTiming>;
    preloadQueries: PreloadQueriesByURL;
    router: RouterContextData;
    buyerIpHeader?: string;
    [key: string]: any;
  };

  constructor(input: any);
  constructor(input: RequestInfo, init?: RequestInit);
  constructor(input: RequestInfo | any, init?: RequestInit) {
    if (input instanceof Request) {
      super(input, init);
    } else {
      super(getUrlFromNodeRequest(input), getInitFromNodeRequest(input));
    }

    this.time = getTime();
    this.id = generateId();

    this.ctx = {
      cache: new Map(),
      head: new HeadData({}),
      router: {
        routeRendered: false,
        serverProps: {},
        routeParams: {},
      },
      queryCacheControl: [],
      queryTimings: [],
      preloadQueries: new Map(),
    };
    this.cookies = this.parseCookies();

    const referer = this.headers.get('referer');
    this.preloadURL =
      this.isRscRequest() && referer && referer !== '' ? referer : this.url;
  }

  private parseCookies() {
    const cookieString = this.headers.get('cookie') || '';

    return new Map(
      cookieString
        .split(';')
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk !== '')
        .map((chunk) => chunk.split(/=(.+)/) as [string, string])
    );
  }

  public isRscRequest() {
    const url = new URL(this.url);
    return url.pathname === RSC_PATHNAME;
  }

  public savePreloadQuery(query: PreloadQueryEntry) {
    if (typeof query.preload === 'string' && query.preload === PRELOAD_ALL) {
      saveToPreloadAllPreload(query);
    } else if (query.preload) {
      this.ctx.preloadQueries.set(hashKey(query.key), query);
    }
  }

  public getPreloadQueries(): PreloadQueriesByURL | undefined {
    if (preloadCache.has(this.preloadURL)) {
      const combinedPreloadQueries: PreloadQueriesByURL = new Map();
      const urlPreloadCache = preloadCache.get(this.preloadURL);

      mergeMapEntries(combinedPreloadQueries, urlPreloadCache);
      mergeMapEntries(combinedPreloadQueries, preloadCache.get(PRELOAD_ALL));

      return combinedPreloadQueries;
    } else if (preloadCache.has(PRELOAD_ALL)) {
      return preloadCache.get(PRELOAD_ALL);
    }
  }

  public savePreloadQueries() {
    preloadCache.set(this.preloadURL, this.ctx.preloadQueries);
  }

  /**
   * Buyer IP varies by hosting provider and runtime. The developer should provide this
   * as an argument to the `handleRequest` function for their runtime.
   * Defaults to `x-forwarded-for` header value.
   */
  public getBuyerIp() {
    return this.headers.get(this.ctx.buyerIpHeader ?? 'x-forwarded-for');
  }
}

function mergeMapEntries(
  map1: PreloadQueriesByURL,
  map2: PreloadQueriesByURL | undefined
) {
  map2 && map2.forEach((v, k) => map1.set(k, v));
}

function saveToPreloadAllPreload(query: PreloadQueryEntry) {
  let setCache = preloadCache.get(PRELOAD_ALL);
  if (!setCache) {
    setCache = new Map();
  }
  setCache?.set(hashKey(query.key), query);
  preloadCache.set(PRELOAD_ALL, setCache);
}

/**
 * @see https://github.com/frandiox/vitedge/blob/17f3cd943e86d7c0c71a862985ddd6caa2899425/src/node/utils.js#L19-L24
 *
 * Note: Request can sometimes be an instance of Express request, where `originalUrl` is the true source of what the
 * URL pathname is. We want to use that if it's present, so we union type this to `any`.
 */
function getUrlFromNodeRequest(request: any) {
  const url: string = request.originalUrl ?? request.url;
  if (url && !url.startsWith('/')) return url;

  // TODO: Find out how to determine https from `request` object without forwarded proto
  const secure = request.headers['x-forwarded-proto'] === 'https';

  return new URL(
    `${secure ? 'https' : 'http'}://${request.headers.host! + url}`
  ).toString();
}

function getInitFromNodeRequest(request: any) {
  const init = {
    headers: new Headers(request.headers as {[key: string]: string}),
    method: request.method,
    body:
      request.method !== 'GET' && request.method !== 'HEAD'
        ? request.body
        : undefined,
  };

  const remoteAddress = request.socket.remoteAddress;
  if (!init.headers.has('x-forwarded-for') && remoteAddress) {
    init.headers.set('x-forwarded-for', remoteAddress);
  }

  return init;
}
