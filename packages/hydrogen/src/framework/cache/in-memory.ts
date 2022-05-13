import {logCacheApiStatus} from '../../utilities/log';

type CacheMatch = {
  value: Response;
  date: Date;
};

export class InMemoryCache implements Cache {
  #store: Map<string, CacheMatch>;

  constructor() {
    this.#store = new Map();
  }

  add(request: RequestInfo): Promise<void> {
    throw new Error('Method not implemented. Use `put` instead.');
  }

  addAll(requests: RequestInfo[]): Promise<void> {
    throw new Error('Method not implemented. Use `put` instead.');
  }

  matchAll(
    request?: RequestInfo,
    options?: CacheQueryOptions
  ): Promise<readonly Response[]> {
    throw new Error('Method not implemented. Use `match` instead.');
  }

  async put(request: Request, response: Response) {
    if (request.method !== 'GET') {
      throw new TypeError('Cannot cache response to non-GET request.');
    }

    if (response.status === 206) {
      throw new TypeError(
        'Cannot cache response to a range request (206 Partial Content).'
      );
    }

    if (response.headers.get('vary')?.includes('*')) {
      throw new TypeError("Cannot cache response with 'Vary: *' header.");
    }

    logCacheApiStatus('PUT-dev', request.url);
    this.#store.set(request.url, {
      value: response,
      date: new Date(),
    });
  }

  async match(request: Request) {
    const match = this.#store.get(request.url);

    if (!match) {
      logCacheApiStatus('MISS-dev', request.url);
      return;
    }

    const {value, date} = match;

    const cacheControl = value.headers.get('cache-control') || '';
    const maxAge = parseInt(
      cacheControl.match(/max-age=(\d+)/)?.[1] || '0',
      10
    );
    const swr = parseInt(
      cacheControl.match(/stale-while-revalidate=(\d+)/)?.[1] || '0',
      10
    );
    const age = (new Date().valueOf() - date.valueOf()) / 1000;

    const isMiss = age > maxAge + swr;
    if (isMiss) {
      logCacheApiStatus('MISS-dev', request.url);
      this.#store.delete(request.url);
      return;
    }

    const isStale = age > maxAge;

    const headers = new Headers(value.headers);
    headers.set('cache', isStale ? 'STALE' : 'HIT');
    headers.set('date', date.toUTCString());
    logCacheApiStatus(`${headers.get('cache')}-dev`, request.url);

    const response = new Response(value.body, {
      headers,
    });

    return response;
  }

  async delete(request: Request) {
    if (this.#store.has(request.url)) {
      this.#store.delete(request.url);
      logCacheApiStatus('DELETE-dev', request.url);
      return true;
    }
    return false;
  }

  keys(request?: Request) {
    const cacheKeys = [] as Request[];

    for (const url of this.#store.keys()) {
      if (!request || request.url === url) {
        cacheKeys.push(new Request(url));
      }
    }

    return Promise.resolve(cacheKeys);
  }
}
