import {renderToString} from 'react-dom/server';
import {CacheOptions} from '../../types';
import {generateCacheControlHeader} from '../cache';

export class ServerComponentResponse extends Response {
  private wait = false;
  private cacheOptions?: CacheOptions;

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
