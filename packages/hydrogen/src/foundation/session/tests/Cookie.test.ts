import {Cookie} from '../Cookie';

const options = {
  httponly: true,
  secure: true,
  samesite: 'Strict',
  path: '/',
  expires: new Date(1649189942953),
  domain: 'shopify.dev',
  maxage: 60 * 60 * 24 * 30,
};

describe('Cookie', () => {
  it('parses a cookie', () => {
    const cookie = new Cookie('__session', options);
    cookie.parse(
      '__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%7D; Expires=Thu, 05 May 2022 20:17:51 GMT; Max-Age=2592000; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly'
    );

    expect(cookie.data).toStrictEqual({
      a: 'b',
      c: 'd',
    });
  });

  it('serializes a cookie', () => {
    const cookie = new Cookie('__session', options);
    cookie.set('a', 'b');
    cookie.set('c', 'd');

    expect(cookie.serialize()).toMatchInlineSnapshot(
      `"__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%7D; Expires=Tue, 05 Apr 2022 20:19:02 GMT; Max-Age=2592000; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    );
  });

  it('destroys a cookie', () => {
    const cookie = new Cookie('__session', options);
    cookie.parse(
      '__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%7D; Expires=Thu, 05 May 2022 20:17:51 GMT; Max-Age=2592000; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly'
    );

    expect(cookie.destroy()).toMatchInlineSnapshot(
      `"__session=; Expires=Tue, 05 Apr 2022 20:19:02 GMT; Max-Age=2592000; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    );
  });
});
