import React, {Suspense} from 'react';
import {useShopQuery} from '../index.js';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';
import {ServerRequestProvider} from '../../../foundation/ServerRequestProvider/index.js';
import {HydrogenRequest} from '../../../foundation/HydrogenRequest/HydrogenRequest.server.js';
import {setCache} from '../../../foundation/runtime.js';
import {InMemoryCache} from '../../../framework/cache/in-memory.js';

jest.mock('../../../foundation/ssr-interop', () => {
  return {
    ...(jest.requireActual('../../../foundation/ssr-interop') as {}),
    META_ENV_SSR: true,
  };
});

jest.mock('../../../foundation/useUrl/useUrl', () => ({
  useUrl: () => new URL('https://store-name.com/'),
}));

let waitUntilPromises = [] as Array<Promise<any>>;

function mountComponent() {
  function Component() {
    const result = useShopQuery({query: 'query { test {} }'});
    return <div>{JSON.stringify(result)}</div>;
  }

  const request = new HydrogenRequest(new Request('https://example.com'));

  request.ctx.runtime = {
    waitUntil: (p: Promise<any>) => waitUntilPromises.push(p),
  };

  return mountWithProviders(
    <ServerRequestProvider request={request}>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </ServerRequestProvider>
  );
}

describe('useShopQuery', () => {
  const originalFetch = globalThis.fetch;
  const mockedFetch = jest.fn(originalFetch);
  let cache: Cache;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    globalThis.fetch = mockedFetch;
  });

  beforeEach(() => {
    waitUntilPromises = [];
    cache = new InMemoryCache() as unknown as Cache;
    setCache(cache);
    consoleErrorSpy = jest.spyOn(console, 'error');
    consoleErrorSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
    setCache(undefined);
  });

  it('fetches data and uses the cache', async () => {
    const successResult = '{"data":{"success":true}}';
    mockedFetch.mockResolvedValue(new Response(successResult, {status: 200}));
    const component = await mountComponent();

    expect(await cache.keys()).toHaveLength(0);

    await component.act(async () => {
      await Promise.all(waitUntilPromises);
    });

    expect(component).toContainReactComponent('div', {
      children: successResult,
    });

    expect(await cache.keys()).toHaveLength(1);
  });

  it('handles GraphQL errors with OK status', async () => {
    const errorResult = '{"errors":[{}]}';
    mockedFetch.mockResolvedValue(new Response(errorResult, {status: 200}));
    const component = await mountComponent();

    expect(await cache.keys()).toHaveLength(0);

    await component.act(async () => {
      await Promise.all(waitUntilPromises);
    });

    expect(component).toContainReactComponent('div', {
      children: errorResult,
    });

    expect(await cache.keys()).toHaveLength(0);
  });

  it('handles 500 errors', async () => {
    mockedFetch.mockResolvedValue(new Response('{}', {status: 500}));
    const component = await mountComponent();

    expect(await cache.keys()).toHaveLength(0);

    await component.act(async () => {
      await Promise.all(waitUntilPromises);
    });

    expect(component).toContainReactComponent('div', {
      children: '{}',
    });

    expect(await cache.keys()).toHaveLength(0);
  });
});
