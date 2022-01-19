import {IncomingMessage} from 'http';
import {ServerComponentRequest} from '../ServerComponentRequest.server';

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
