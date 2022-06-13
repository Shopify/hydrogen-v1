type CacheMatch = {
  value: Response;
  timestamp: number;
};

const defaultClock = () => ({
  timestamp: Date.now(),
});

export type ClockFunction = () => {timestamp: number};

/**
 * This is a limited implementation of an in-memory cache.
 * It only supports the `cache-control` header.
 * It does NOT support `age` or `expires` headers.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache
 */
export class InMemoryCache implements Cache {
  #store: Map<string, CacheMatch>;
  #clock: ClockFunction;

  constructor(clock: ClockFunction = defaultClock) {
    this.#store = new Map();
    this.#clock = clock;
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

    this.#store.set(request.url, {
      value: response,
      timestamp: this.#clock().timestamp,
    });
  }

  async match(request: Request) {
    const match = this.#store.get(request.url);

    if (!match) {
      return;
    }

    const {value, timestamp} = match;

    const cacheControl = value.headers.get('cache-control') || '';
    const maxAge = parseInt(
      cacheControl.match(/max-age=(\d+)/)?.[1] || '0',
      10
    );
    const swr = parseInt(
      cacheControl.match(/stale-while-revalidate=(\d+)/)?.[1] || '0',
      10
    );
    const age = (this.#clock().timestamp - timestamp) / 1000;

    const isMiss = age > maxAge + swr;
    if (isMiss) {
      this.#store.delete(request.url);
      return;
    }

    const isStale = age > maxAge;

    const headers = new Headers(value.headers);
    headers.set('cache', isStale ? 'STALE' : 'HIT');
    headers.set('date', new Date(timestamp).toUTCString());

    const response = new Response(value.body, {
      headers,
    });

    return response;
  }

  async delete(request: Request) {
    if (this.#store.has(request.url)) {
      this.#store.delete(request.url);
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
