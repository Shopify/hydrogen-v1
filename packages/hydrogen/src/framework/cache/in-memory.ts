type CacheMatch = {
  value: Response;
  date: Date;
};

/**
 * This is an in-memory implementation of `Cache` that *barely*
 * works and is only meant to be used during development.
 */
export class InMemoryCache {
  private store: Map<string, CacheMatch>;

  constructor() {
    this.store = new Map();
  }

  put(request: Request, response: Response) {
    this.store.set(request.url, {
      value: response,
      date: new Date(),
    });
  }

  match(request: Request) {
    const match = this.store.get(request.url);

    if (!match) {
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
      this.store.delete(request.url);
      return;
    }

    const isStale = age > maxAge;

    const headers = new Headers(value.headers);
    headers.set('cache', isStale ? 'STALE' : 'HIT');
    headers.set('date', date.toUTCString());

    const response = new Response(value.body, {
      headers,
    });

    return response;
  }

  delete(request: Request) {
    this.store.delete(request.url);
  }

  keys(request?: Request) {
    const cacheKeys = [] as Request[];

    for (const url of this.store.keys()) {
      if (!request || request.url === url) {
        cacheKeys.push(new Request(url));
      }
    }

    return Promise.resolve(cacheKeys);
  }
}
