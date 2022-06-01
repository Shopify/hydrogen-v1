import {IncomingMessage} from 'http';
import {RSC_PATHNAME} from '../../../constants';
import {PreloadOptions} from '../../../types';
import {PreloadQueryEntry, HydrogenRequest} from '../HydrogenRequest.server';

describe('HydrogenRequest', () => {
  it('converts node request to Fetch API request', () => {
    const request = createServerComponentRequest('/', {
      'user-agent': 'Shopify Computer',
    });
    expect(request.headers.get('user-agent')).toBe('Shopify Computer');
  });

  describe('Cookies', () => {
    it('creats a empty Map of cookies by default', () => {
      const request = createServerComponentRequest('/');
      expect(request.cookies.size).toBe(0);
    });

    it('provides just a really nice interface for Cookies', () => {
      const request = createServerComponentRequest('/', {
        cookie: 'shopifyCartId=12345; favoriteFruit=apple;',
      });

      expect(request.cookies.size).toBe(2);
      expect(request.cookies.get('shopifyCartId')).toBe('12345');
    });

    it('handles JSON serialized Cookies', () => {
      const cookieKey = 'productIds';
      const productIds = ['productId1=', 'productId2='];
      const serializedProductIds = JSON.stringify(productIds);

      const request = createServerComponentRequest('/', {
        cookie: `shopifyCartId=12345; ${cookieKey}=${serializedProductIds}`,
      });

      expect(JSON.parse(request.cookies.get(cookieKey)!)).toStrictEqual(
        productIds
      );
    });
  });

  it('does not save preload queries when preload key is not present', () => {
    const request = createServerComponentRequest(`https://localhost:3000/`);
    request.savePreloadQuery(createPreloadQueryEntry('test1'));
    request.savePreloadQueries();

    const preloadQueries = request.getPreloadQueries();
    expect(preloadQueries?.size).toEqual(0);
  });

  it('saves preload queries', () => {
    const request = createServerComponentRequest(`https://localhost:3000/`);
    request.savePreloadQuery(createPreloadQueryEntry('test1', true));
    request.savePreloadQueries();

    const preloadQueries = request.getPreloadQueries();
    expect(preloadQueries).toBeDefined();
    expect(preloadQueries && preloadQueries.get('"test1"'))
      .toMatchInlineSnapshot(`
      Object {
        "fetcher": [Function],
        "key": Array [
          "test1",
        ],
        "preload": true,
      }
    `);
  });

  it('get preload queries on sub-sequent load', () => {
    const request = createServerComponentRequest(`https://localhost:3000/`);
    request.savePreloadQuery(createPreloadQueryEntry('test1', true));
    request.savePreloadQueries();

    const request2 = createServerComponentRequest(`https://localhost:3000/`);

    const preloadQueries = request2.getPreloadQueries();
    expect(preloadQueries).toBeDefined();
    expect(preloadQueries && preloadQueries.get('"test1"'))
      .toMatchInlineSnapshot(`
      Object {
        "fetcher": [Function],
        "key": Array [
          "test1",
        ],
        "preload": true,
      }
    `);
  });

  it('populates buyer IP using Node socket by default', () => {
    const request = createServerComponentRequest('/', undefined, '123.4.5.6');

    expect(request.getBuyerIp()).toBe('123.4.5.6');
  });

  it('allows buyer IP header to be overridden', () => {
    const request = createServerComponentRequest('/', {foo: '234.5.6.7'});
    request.ctx.buyerIpHeader = 'foo';

    expect(request.getBuyerIp()).toBe('234.5.6.7');
  });

  it('provides a normalized URL for both RSC and standard requests', () => {
    const request = createServerComponentRequest(
      'https://shopify.dev/foo?bar=baz'
    );
    expect(request.normalizedUrl).toBe('https://shopify.dev/foo?bar=baz');

    const rscRequest = createServerComponentRequest(
      `https://shopify.dev${RSC_PATHNAME}?state=${encodeURIComponent(
        JSON.stringify({pathname: '/foo', search: '?bar=baz'})
      )}`
    );
    expect(rscRequest.normalizedUrl).toBe('https://shopify.dev/foo?bar=baz');
  });
});

function createServerComponentRequest(
  url: string,
  headers?: Record<string, string>,
  remoteAddress?: string
): HydrogenRequest {
  // @ts-ignore
  const nodeRequest = new IncomingMessage();
  nodeRequest.method = 'GET';
  nodeRequest.url = url;
  nodeRequest.headers = headers ?? {};
  // @ts-ignore
  nodeRequest.socket = {remoteAddress: remoteAddress ?? '127.0.0.1'};

  return new HydrogenRequest(nodeRequest);
}

function createPreloadQueryEntry(
  key: string,
  preload?: PreloadOptions
): PreloadQueryEntry {
  return {
    key: [key],
    fetcher: createFetcher(key),
    preload,
  };
}

function createFetcher(data: unknown): () => Promise<unknown> {
  return () => Promise.resolve(data);
}
