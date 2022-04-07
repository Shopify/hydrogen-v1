import type {SessionStorageAdapter} from './session';
import {Cookie, CookieOptions} from './Cookie';

export const CookieSessionStorage = function (
  name: string,
  options: CookieOptions
): () => SessionStorageAdapter {
  return function () {
    const cookie = new Cookie(name, options);
    let parsed = false;

    return {
      async get(request: Request): Promise<Record<string, string>> {
        if (!parsed) {
          const cookieValue = request.headers.get('cookie');
          cookie.parse(cookieValue || '');
          parsed = true;
        }
        return cookie.data;
      },
      async set(request: Request, value: Record<string, string>) {
        cookie.setAll(value);
        return cookie.serialize();
      },
      async destroy(request: Request) {
        // @todo - set expires for Date in past
        return cookie.destroy();
      },
    };
  };
};
