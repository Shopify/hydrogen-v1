import {logCacheApiStatus} from '../../utilities/log';

/**
 * This is an in-memory implementation of `Cache` that *barely*
 * works and is only meant to be used during development.
 */
export class InMemoryCache {
  private store: Map<string, any>;

  constructor() {
    this.store = new Map();
  }

  put(request: Request, response: Response) {
    logCacheApiStatus('PUT', request.url);
    this.store.set(request.url, {
      value: response,
      date: new Date(),
    });
  }

  match(request: Request) {
    const match = this.store.get(request.url);

    if (!match) {
      logCacheApiStatus('MISS', request.url);
      return;
    }

    const {value, date} = match;

    const cacheControl = value.headers.get('cache-control');
    const maxAge = parseInt(cacheControl.match(/max-age=(\d+)/)[1], 10);
    const swr = parseInt(
      cacheControl.match(/stale-while-revalidate=(\d+)/)[1],
      10
    );
    const age = (new Date().valueOf() - date) / 1000;

    const isMiss = age > maxAge + swr;
    if (isMiss) {
      logCacheApiStatus('MISS', request.url);
      this.store.delete(request.url);
      return;
    }

    const isStale = age > maxAge;

    const headers = new Headers(value.headers);
    headers.set('cache', isStale ? 'STALE' : 'HIT');
    headers.set('date', date.toGMTString());
    logCacheApiStatus(headers.get('cache'), request.url);

    const response = new Response(value.body, {
      headers,
    });

    return response;
  }

  delete(request: Request) {
    this.store.delete(request.url);
    logCacheApiStatus('DELETE', request.url);
  }
}
