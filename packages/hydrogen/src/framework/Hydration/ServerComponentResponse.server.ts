import {renderToString} from 'react-dom/server';
import {CacheOptions} from '../../types';
import {generateCacheControlHeader} from '../cache';

export class ServerComponentResponse extends Response {
  private wait = false;
  private cacheOptions?: CacheOptions;

  public customStatus?: {code?: number; text?: string};

  /**
   * Allow custom body to be a string or a Promise.
   */
  public customBody: string | Promise<string> = '';

  /**
   * Buffer the current response until all queries have resolved,
   * and prevent it from streaming back early.
   */
  doNotStream() {
    this.wait = true;
  }

  canStream() {
    return !this.wait;
  }

  cache(options: CacheOptions) {
    this.cacheOptions = options;
  }

  get cacheControlHeader(): string {
    const options = {
      ...DEFAULT_CACHE_OPTIONS,
      ...(this.cacheOptions ?? {}),
    };

    return generateCacheControlHeader(options);
  }

  writeHead({
    status,
    statusText,
    headers,
  }: {
    status?: number;
    statusText?: string;
    headers?: Record<string, any>;
  } = {}) {
    if (status || statusText) {
      this.customStatus = {code: status, text: statusText};
    }

    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        this.headers.set(key, value);
      }
    }
  }

  redirect(location: string, status = 307) {
    this.writeHead({status, headers: {location}});
  }

  /**
   * Send the response from a Server Component. Renders React components to string,
   * and returns `null` to make React happy.
   */
  send(body: any) {
    if (
      typeof body === 'object' &&
      body.$$typeof === Symbol.for('react.element')
    ) {
      this.customBody = renderToString(body);
    } else {
      this.customBody = body;
    }

    return null;
  }
}

const DEFAULT_CACHE_OPTIONS: CacheOptions = {
  maxAge: 60 * 60,
  staleWhileRevalidate: 23 * 60 * 60,
};
