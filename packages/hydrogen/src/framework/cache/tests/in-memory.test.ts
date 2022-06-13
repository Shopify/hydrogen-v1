import {ClockFunction, InMemoryCache} from '../in-memory';

describe('In-Memory Cache', () => {
  const clock = {timestamp: 1000};
  const clockFunction: ClockFunction = () => clock;

  it('uses cache control header to persist', async () => {
    const cache = new InMemoryCache(clockFunction);
    const request = new Request('https://shopify.dev/');
    const response = new Response('Hello World');
    response.headers.set('cache-control', 'max-age=60');
    await cache.put(request, response);

    clock.timestamp += 59 * 1000;

    const cachedResponse = await cache.match(request);
    expect(cachedResponse).toBeDefined();
    expect(cachedResponse!.headers.get('cache-control')).toBe(
      response.headers.get('cache-control')
    );
    expect(cachedResponse!.headers.get('cache')).toBe('HIT');

    clock.timestamp += 2 * 1000;

    expect(await cache.match(request)).toBeUndefined();
  });

  it('supports stale-while-revalidate', async () => {
    const cache = new InMemoryCache(clockFunction);
    const request = new Request('https://shopify.dev/');
    const response = new Response('Hello World');
    response.headers.set(
      'cache-control',
      'max-age=10, stale-while-revalidate=60'
    );
    await cache.put(request, response);

    clock.timestamp += 9 * 1000;

    let cachedResponse;

    cachedResponse = await cache.match(request);
    expect(cachedResponse).toBeDefined();
    expect(cachedResponse!.headers.get('cache')).toBe('HIT');

    clock.timestamp += 2 * 1000;

    cachedResponse = await cache.match(request);
    expect(cachedResponse).toBeDefined();
    expect(cachedResponse!.headers.get('cache')).toBe('STALE');

    clock.timestamp += 60 * 1000;
    expect(await cache.match(request)).toBeUndefined();
  });

  it('supports deleting cache entries', async () => {
    const cache = new InMemoryCache(clockFunction);
    const request = new Request('https://shopify.dev/');
    const response = new Response('Hello World');
    response.headers.set('cache-control', 'max-age=10');
    await cache.put(request, response);

    clock.timestamp += 9 * 1000;

    const cachedResponse = await cache.match(request);
    expect(cachedResponse).toBeDefined();
    expect(cachedResponse!.headers.get('cache')).toBe('HIT');

    expect(await cache.delete(request)).toBeTruthy();

    expect(await cache.match(request)).toBeUndefined();
  });

  it('deletes entry when encountering cache MISS', async () => {
    const cache = new InMemoryCache(clockFunction);
    const request = new Request('https://shopify.dev/');
    const response = new Response('Hello World');
    response.headers.set('cache-control', 'max-age=10');
    cache.put(request, response);

    clock.timestamp += 11 * 1000;

    expect(await cache.match(request)).toBeUndefined();

    // Falsy indicates there was nothing to be deleted
    expect(await cache.delete(request)).toBeFalsy();
  });

  it('reads the body', async () => {
    const cache = new InMemoryCache(clockFunction);
    const request = new Request('https://shopify.dev/');
    const response = new Response('Hello World');
    await cache.put(request, response);

    const cachedResponse = await cache.match(request);
    expect(await cachedResponse!.text()).toBe('Hello World');
  });
});
