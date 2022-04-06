import {Logger} from '../../../utilities/log';
import {FileSessionStorage} from '../FileSessionStorage';
import path from 'path';
import {promises as fsp} from 'fs';

const options = {
  httponly: true,
  secure: true,
  samesite: 'Strict',
  path: '/',
  expires: new Date(1649189942953),
  domain: 'shopify.dev',
  maxage: 60 * 60 * 24 * 30,
};

const sessionFilePath = path.resolve(
  __dirname,
  'sessions',
  'eca0b9',
  'ec-c013-4ea1-8236-df6ed02f00c4'
);

let request: Request;
let log: Logger;

describe('MemorySessionStorage', () => {
  beforeEach(async () => {
    log = {
      warn: jasmine.createSpy(),
      error: () => {},
      trace: () => {},
      debug: () => {},
      fatal: () => {},
      options: () => {
        return {};
      },
    };

    await fsp.mkdir(path.resolve(__dirname, 'sessions'));

    request = new Request('', {
      headers: {
        cookie:
          '__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%2C%22sid%22%3A%22eca0b9ec-c013-4ea1-8236-df6ed02f00c4%22%7D; Expires=Tue, 05 Apr 2022 20:19:02 GMT; Max-Age=2592000; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly',
      },
    });
  });

  afterEach(async () => {
    await fsp.rm(path.resolve(__dirname, 'sessions'), {recursive: true});
  });

  it('creates a file with an empty session', async () => {
    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log);

    const data = await session.get(request);

    expect(data).toStrictEqual({});
    await expectFileContentsToBe(
      'eca0b9ec-c013-4ea1-8236-df6ed02f00c4',
      '{"data":{},"expires":1649189942953}'
    );
  });

  it('writes a file with session data', async () => {
    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log);

    const cookie = await session.set(request, {some: 'data'});
    expect(cookie).toMatchInlineSnapshot(
      `"__session=%7B%22a%22%3A%22b%22%2C%22c%22%3A%22d%22%2C%22sid%22%3A%22eca0b9ec-c013-4ea1-8236-df6ed02f00c4%22%7D; Expires=Tue, 05 Apr 2022 20:19:02 GMT; Max-Age=2592000; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    );

    await expectFileContentsToBe(
      'eca0b9ec-c013-4ea1-8236-df6ed02f00c4',
      '{"data":{"some":"data"},"expires":1649189942953}'
    );
  });

  it('reads a previous session out of a file', async () => {
    await createSessionFile(
      sessionFilePath,
      '{"data":{"previous":"data"},"expires":16491899429650}'
    );
    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log);

    const data = await session.get(request);

    expect(data).toStrictEqual({previous: 'data'});
  });

  it('warns if a corrupt file is read', async () => {
    await createSessionFile(sessionFilePath, '{CORUPTDATA..}');

    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log);

    const data = await session.get(request);

    expect(data).toStrictEqual({});
    await expectFileContentsToBe(
      'eca0b9ec-c013-4ea1-8236-df6ed02f00c4',
      '{"data":{},"expires":1649189942953}'
    );
    expect(log.warn).toHaveBeenCalledWith(
      'Cannot parse existing session file: /Users/blittle/dev/hydrogen/packages/hydrogen/src/foundation/session/tests/sessions/eca0b9/ec-c013-4ea1-8236-df6ed02f00c4'
    );
  });

  it('resets session when expired', async () => {
    await createSessionFile(
      sessionFilePath,
      '{"data":{"old": "data"},"expires":164918994}'
    );
    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log);

    const data = await session.get(request);

    expect(data).toStrictEqual({});
    await expectFileContentsToBe(
      'eca0b9ec-c013-4ea1-8236-df6ed02f00c4',
      '{"data":{},"expires":1649189942953}'
    );
  });

  it('destroys session', async () => {
    await createSessionFile(
      sessionFilePath,
      '{"data":{"old": "data"},"expires":164918994}'
    );
    const session = FileSessionStorage(
      '__session',
      path.resolve(__dirname, 'sessions'),
      options
    )(log);

    const cookieString = await session.destroy(request);

    expect(cookieString).toMatchInlineSnapshot(
      `"__session=; Expires=Tue, 05 Apr 2022 20:19:02 GMT; Max-Age=2592000; Domain=shopify.dev; Path=/; SameSite=Strict; Secure; HttpOnly"`
    );

    expect(async () => fsp.access(sessionFilePath)).rejects.toThrow();
  });
});

async function createSessionFile(sessionFilePath: string, contents: string) {
  await fsp.mkdir(path.dirname(sessionFilePath), {
    recursive: true,
  });
  await fsp.writeFile(sessionFilePath, contents, {
    encoding: 'utf-8',
    flag: 'w+',
  });
}

async function expectFileContentsToBe(sid: string, result: string) {
  expect(
    await fsp.readFile(
      path.resolve(__dirname, 'sessions', sid.slice(0, 6), sid.slice(6)),
      {
        encoding: 'utf-8',
      }
    )
  ).toBe(result);
}
