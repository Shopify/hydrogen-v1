import {getTime} from '../../utilities/timing';
import type {HelmetData} from 'react-helmet-async';

let reqCounter = 0; // For debugging
const generateId =
  typeof crypto !== 'undefined' &&
  // @ts-ignore
  !!crypto.randomUUID
    ? // @ts-ignore
      () => crypto.randomUUID() as string
    : () => `req${++reqCounter}`;

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
  // CFW Request has a reserved 'context' property, use 'ctx' instead.
  public ctx: {
    cache: Map<string, any>;
    helmet?: HelmetData;
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

    this.ctx = {cache: new Map()};
    this.cookies = this.parseCookies();
  }

  private parseCookies() {
    const cookieString = this.headers.get('cookie') || '';

    return new Map(
      cookieString
        .split(';')
        .map((chunk) => chunk.trim().split(/=(.+)/) as [string, string])
    );
  }
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
