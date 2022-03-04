import {IncomingMessage} from 'http';
import {PreloadOptions} from '../../../types';
import {
  PreloadQueryEntry,
  ServerComponentRequest,
} from '../ServerComponentRequest.server';

it('converts node request to Fetch API request', () => {
  // @ts-ignore
  const nodeRequest = new IncomingMessage();
  nodeRequest.headers = {'user-agent': 'Shopify Computer'};
  nodeRequest.method = 'GET';

  const request = new ServerComponentRequest(nodeRequest);
  expect(request.headers.get('user-agent')).toBe('Shopify Computer');
});

it('provides just a really nice interface for Cookies', () => {
  // @ts-ignore
  const nodeRequest = new IncomingMessage();
  nodeRequest.headers = {cookie: 'shopifyCartId=12345; favoriteFruit=apple;'};
  nodeRequest.method = 'GET';

  const request = new ServerComponentRequest(nodeRequest);
  expect(request.cookies.get('shopifyCartId')).toBe('12345');
});

it('handles JSON serialized Cookies', () => {
  const cookieKey = 'productIds';
  const productIds = ['productId1=', 'productId2='];
  const serializedProductIds = JSON.stringify(productIds);

  // @ts-ignore
  const nodeRequest = new IncomingMessage();
  nodeRequest.headers = {
    cookie: `shopifyCartId=12345; ${cookieKey}=${serializedProductIds}`,
  };
  nodeRequest.method = 'GET';

  const request = new ServerComponentRequest(nodeRequest);
  expect(JSON.parse(request.cookies.get(cookieKey)!)).toStrictEqual(productIds);
});

function createServerComponentRequest(
  url: string,
  referer?: string
): ServerComponentRequest {
  // @ts-ignore
  const nodeRequest = new IncomingMessage();
  nodeRequest.method = 'GET';
  nodeRequest.url = url;

  if (referer) {
    nodeRequest.headers = {
      referer,
    };
  }

  return new ServerComponentRequest(nodeRequest);
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
