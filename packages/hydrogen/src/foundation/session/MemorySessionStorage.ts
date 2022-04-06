import type {SessionStorageAdapter} from './session';
import {Cookie} from './Cookie';
import {v4 as uid} from 'uuid';
import {CookieSessionOptions} from './CookieSessionStorage';

function getSessionIdFromRequest(
  request: Request,
  cookie: Cookie
): string | null {
  const cookieValue = request.headers.get('cookie');

  if (cookieValue) {
    return cookie.parse(cookieValue).sid;
  }
  return null;
}

export const MemorySessionStorage = function (
  name: string,
  options: CookieSessionOptions
): () => SessionStorageAdapter {
  const sessions: Record<string, Record<string, string>> = {};

  return function () {
    const cookie = new Cookie(name, options);
    let data: Record<string, string> | undefined;

    return {
      async get(request: Request): Promise<Record<string, string>> {
        if (data) return data;

        const sid = getSessionIdFromRequest(request, cookie);

        data = sid && sessions[sid] ? sessions[sid] : {};

        return data;
      },
      async set(request: Request, value: Record<string, string>) {
        let sid = getSessionIdFromRequest(request, cookie);

        if (!sid) {
          sid = uid();
        }

        sessions[sid] = value;
        data = value;

        cookie.set('sid', sid);

        return cookie.serialize();
      },
      async destroy(request: Request) {
        const sid = getSessionIdFromRequest(request, cookie);

        if (sid) {
          delete sessions[sid];
        }

        data = undefined;

        // @todo - set expires for Date in past
        return cookie.destroy();
      },
    };
  };
};
