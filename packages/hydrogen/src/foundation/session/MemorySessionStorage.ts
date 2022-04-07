import type {SessionStorageAdapter} from './session';
import {Cookie} from './Cookie';
import {v4 as uid} from 'uuid';
import {CookieOptions} from './Cookie';

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
  options: CookieOptions
): () => SessionStorageAdapter {
  const sessions: Map<string, {data: Record<string, string>; expires: number}> =
    new Map();

  return function () {
    const cookie = new Cookie(name, options);

    return {
      async get(request: Request): Promise<Record<string, string>> {
        const sid = getSessionIdFromRequest(request, cookie);
        let sessionData;

        if (sid && sessions.has(sid)) {
          const {expires, data} = sessions.get(sid)!;

          if (expires < new Date().getTime()) {
            sessions.delete(sid);
            sessionData = {};
          } else {
            sessionData = data;
          }
        } else {
          sessionData = {};
        }

        return sessionData;
      },
      async set(request: Request, value: Record<string, string>) {
        let sid = getSessionIdFromRequest(request, cookie);

        if (!sid) {
          sid = uid();
        }

        sessions.set(sid, {
          data: value,
          expires: cookie.expires,
        });

        cookie.set('sid', sid);

        return cookie.serialize();
      },
      async destroy(request: Request) {
        const sid = getSessionIdFromRequest(request, cookie);

        if (sid) {
          sessions.delete(sid);
        }

        return cookie.destroy();
      },
    };
  };
};
