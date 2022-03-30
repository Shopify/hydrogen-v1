import React, {Suspense} from 'react';
import {useShopQuery} from '../hooks';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {ServerRequestProvider} from '../../../foundation/ServerRequestProvider';
import {ServerComponentRequest} from '../../../framework/Hydration/ServerComponentRequest.server';
import {setCache, setContext} from '../../../framework/runtime';
import {InMemoryCache} from '../../../framework/cache/in-memory';

jest.mock('../../../foundation/ssr-interop', () => {
  return {
    ...(jest.requireActual('../../../foundation/ssr-interop') as {}),
    META_ENV_SSR: true,
  };
});

function mountComponent() {
  function Component() {
    const result = useShopQuery({query: 'query { test {} }'});
    return <div>{JSON.stringify(result)}</div>;
  }

  const request = new ServerComponentRequest(
    new Request('https://example.com')
  );

  return mountWithProviders(
    <ServerRequestProvider request={request} isRSC={true}>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </ServerRequestProvider>
  );
}

describe('useShopQuery', () => {
  const originalFetch = globalThis.fetch;
  const mockedFetch = jest.fn(originalFetch);
  let waitUntilPromises: Array<Promise<any>>;
  let cache: Cache;

  beforeAll(() => {
    globalThis.fetch = mockedFetch;
  });

  beforeEach(() => {
    waitUntilPromises = [];
    setContext({waitUntil: (p: Promise<any>) => waitUntilPromises.push(p)});
    cache = new InMemoryCache() as unknown as Cache;
    setCache(cache);
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
    setContext(undefined);
    setCache(undefined);
  });

  it('fetches data and uses the cache', async () => {
    const successResult = '{"data":{"success":true}}';
    mockedFetch.mockResolvedValue(new Response(successResult, {status: 200}));
    const component = await mountComponent();

    expect(cache.keys()).resolves.toHaveLength(0);

    await component.act(async () => {
      await Promise.all(waitUntilPromises);
    });

    expect(component).toContainReactComponent('div', {
      children: successResult,
    });

    expect(cache.keys()).resolves.toHaveLength(1);
  });

  it('handles GraphQL errors with OK status', async () => {
    const errorResult = '{"errors":[{}]}';
    mockedFetch.mockResolvedValue(new Response(errorResult, {status: 200}));
    const component = await mountComponent();

    expect(cache.keys()).resolves.toHaveLength(0);

    await component.act(async () => {
      await Promise.all(waitUntilPromises);
    });

    expect(component).toContainReactComponent('div', {
      children: errorResult,
    });

    expect(cache.keys()).resolves.toHaveLength(0);
  });
});
