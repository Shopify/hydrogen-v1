import type {SessionStorageAdapter} from './session';
import {Cookie} from './session';

export type CookieSessionOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
  path?: string;
  expires?: Date;
  domain?: string;
  maxAge?: number;
};

export const CookieSessionStorage = function (
  name: string,
  options: CookieSessionOptions
): () => SessionStorageAdapter {
  return function () {
    const cookie = new Cookie(name, options);
    let parsed = false;

    return {
      async get(request: Request, id: string): Promise<Record<string, string>> {
        if (!parsed) {
          const cookieValue = request.headers.get('cookie');
          cookie.parse(cookieValue || '');
          parsed = true;
        }
        return cookie.data;
      },
      async set(id: string, value: Record<string, string>) {
        cookie.setAll(value);
        return cookie.serialize();
      },
      async destroy(id: string) {
        return cookie.destroy();
      },
    };
  };
};
