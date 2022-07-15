import {Cookie} from '../Cookie.js';
import {log} from '../../../utilities/log/index.js';

const options = {
  httponly: true,
  secure: true,
  samesite: 'Strict',
  path: '/',
  expires: new Date(1749343178614),
  domain: 'shopify.dev',
};

describe('Cookie', () => {
  let consoleWarnSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(log, 'warn');
    consoleWarnSpy.mockImplementation(() => {});
  });
  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });
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
      `"__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%7D; Expires=Sun, 08 Jun 2025 00:39:38 GMT; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    );
  });

  it('destroys a cookie', () => {
    const cookie = new Cookie('__session', options);
    cookie.parse(
      '__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%7D; Expires=Thu, 05 May 2022 20:17:51 GMT; Max-Age=2592000; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly'
    );

    expect(cookie.destroy()).toMatchInlineSnapshot(
      `"__session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    );
  });

  it('defaults to maxAge', () => {
    const now = Date.now;
    Date.now = jest.fn(() => 1487076708000);
    const cookie = new Cookie('__session', {...options, maxAge: 10});
    expect(cookie.serialize()).toMatchInlineSnapshot(
      `"__session=%7B%7D; Expires=Tue, 14 Feb 2017 12:51:58 GMT; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    );
    Date.now = now;
  });

  it('warns if using oxygen reserved cookie names', () => {
    new Cookie('mac', {...options, maxAge: 10});
    expect(log.warn).toHaveBeenCalledWith(
      'Warning "mac" is a reserved cookie name by oxygen!'
    );

    new Cookie('user_session_id', {...options, maxAge: 10});
    expect(log.warn).toHaveBeenCalledWith(
      'Warning "user_session_id" is a reserved cookie name by oxygen!'
    );
  });
});
