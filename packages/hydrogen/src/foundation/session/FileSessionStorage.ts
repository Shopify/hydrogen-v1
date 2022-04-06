import type {SessionStorageAdapter} from './session';
import {Cookie} from './Cookie';
import {v4 as uid} from 'uuid';
import path from 'path';
import {promises as fsp} from 'fs';
import {CookieSessionOptions} from './CookieSessionStorage';
import {Logger} from '../../utilities/log';

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

async function wait() {
  return new Promise((resolve) => setTimeout(resolve));
}

let writingLock = false;

/**
 * Concurrent requests with the same session can write interfere
 * writing at the same file, which crashes the process. This locks
 * so that only one file can be written at a time.
 *
 * A better solution would be to have a lock only for the same session.
 */
async function startFileLock(promise: () => Promise<any>) {
  if (!writingLock) {
    writingLock = true;
    await promise();
    writingLock = false;
  } else {
    await wait();
    await startFileLock(promise);
  }
}

export const FileSessionStorage = function (
  name: string,
  dir: string,
  cookieOptions: CookieSessionOptions
): (log: Logger) => SessionStorageAdapter {
  const expires: Date = (cookieOptions.expires =
    cookieOptions.expires || new Date(new Date().getTime() + 604_800_000)); // one week

  return function (log: Logger) {
    const cookie = new Cookie(name, cookieOptions);
    let data: Record<string, string> | undefined;

    return {
      async get(request: Request): Promise<Record<string, string>> {
        if (data) return data;

        const sid = getSessionIdFromRequest(request, cookie) || uid();
        const file = getSessionFile(dir, sid);

        const fileContents = await getFile(file, expires, log);
        data = fileContents.data;

        return data;
      },
      async set(request: Request, value: Record<string, string>) {
        const sid = getSessionIdFromRequest(request, cookie) || uid();
        const file = getSessionFile(dir, sid);

        await writeFile(file, value, expires);
        data = value;
        cookie.set('sid', sid);

        return cookie.serialize();
      },
      async destroy(request: Request) {
        const sid = getSessionIdFromRequest(request, cookie);

        if (sid) {
          const file = getSessionFile(dir, sid);
          await deleteFile(file);
        }

        data = undefined;

        // @todo - set expires for Date in past
        return cookie.destroy();
      },
    };
  };
};

type SessionFile = {
  data: Record<string, string>;
  expires: number;
};

async function getFile(
  file: string,
  expires: Date,
  log: Logger
): Promise<SessionFile> {
  let content: SessionFile | null = null;
  const defaultFileContent = {
    data: {},
    expires: expires.getTime(),
  };

  await startFileLock(async () => {
    try {
      const textContent = await fsp.readFile(file, {encoding: 'utf-8'});

      try {
        content = JSON.parse(textContent) as SessionFile;
      } catch (error) {
        log.warn(`Cannot parse existing session file: ${file}`);
        content = defaultFileContent;
      }

      if (
        content.expires < new Date().getTime() ||
        content === defaultFileContent
      ) {
        await fsp.unlink(file);
        await fsp.writeFile(file, JSON.stringify(defaultFileContent), {
          encoding: 'utf-8',
          flag: 'wx',
        });
        content = defaultFileContent;
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') throw error;

      await fsp.mkdir(path.dirname(file), {recursive: true});
      await fsp.writeFile(file, JSON.stringify(defaultFileContent), {
        encoding: 'utf-8',
        flag: 'wx',
      });
    }
  });

  return content ? content : defaultFileContent;
}

async function writeFile(
  file: string,
  data: Record<string, string>,
  expires: Date
) {
  const content: SessionFile = {
    data,
    expires: expires.getTime(),
  };

  await startFileLock(async () => {
    try {
      await fsp.mkdir(path.dirname(file), {recursive: true});
    } catch (error: any) {
      // directory already exists
      if (error.code !== 'EEXIST') throw error;
    }

    try {
      await fsp.unlink(file);
    } catch (error: any) {
      if (error.code !== 'ENOENT') throw error;
    }

    await fsp.writeFile(file, JSON.stringify(content), {
      encoding: 'utf-8',
      flag: 'wx',
    });
  });
}

async function deleteFile(file: string) {
  try {
    await startFileLock(async () => {
      await fsp.unlink(file);
    });
  } catch (error: any) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function getSessionFile(dir: string, sid: string) {
  return path.join(dir, sid.slice(0, 6), sid.slice(6));
}
