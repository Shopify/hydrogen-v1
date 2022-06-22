import {RSC_PATHNAME} from '../../../hydrogen/src/constants';
import {htmlEncode} from '../../../hydrogen/src/utilities';
import fetch from 'node-fetch';
import {resolve} from 'path';

import {edit, untilUpdated} from '../../utilities';

type TestOptions = {
  getServerUrl: () => string;
  isWorker?: boolean;
  isBuild?: boolean;
};

export default async function testCases({
  getServerUrl,
  isBuild,
  isWorker,
}: TestOptions) {
  let page;
  beforeEach(async () => {
    page && (await page.close());
    page = await global.browser.newPage();
  });

  it('shows the homepage, navigates to about, and increases the count', async () => {
    await page.goto(getServerUrl());

    expect(await page.textContent('h1')).toContain('Home');

    expect(await page.getAttribute('body', 'class')).toEqual('pb-1');
    expect(await page.getAttribute('body', 'style')).toEqual(null); // Style is ignored
    expect(await page.getAttribute('body', 'data-my-attr')).toEqual(
      ' some spaces here '
    );

    await page.click('.btn');

    expect(await page.textContent('body')).toContain('About');
    expect(await page.textContent('.count')).toBe('Count is 0');

    await page.click('.increase');
    expect(await page.textContent('.count')).toBe('Count is 1');
  });

  it('renders `<ShopifyProvider>` dynamically in RSC and on the client', async () => {
    // "someDynamicValue should get injected into the response config paylout"
    await page.goto(getServerUrl() + '/config/someDynamicValue');

    expect(await page.textContent('#root > div')).toContain(
      '{"defaultCountryCode":"US","defaultLanguageCode":"EN","storeDomain":"someDynamicValue-domain","storefrontToken":"someDynamicValue-token","storefrontApiVersion":"someDynamicValue-version"}'
    );
  });

  it('follows redirects from SSR responses', async () => {
    await page.goto(getServerUrl() + '/redirected');
    expect(await page.url()).toContain('/about');
    expect(await page.textContent('h1')).toContain('About');
  });

  it('follows redirects in RSC responses', async () => {
    await page.goto(getServerUrl() + '/');
    await page.click('.redirect-btn');
    await page.waitForURL('**/about');

    expect(await page.textContent('h1')).toContain('About');
  });

  it('has access to environment variables', async () => {
    await page.goto(getServerUrl() + '/env');
    expect(await page.textContent('h1')).toContain('Env');

    const secretsServer = await page.textContent('.secrets-server');
    expect(secretsServer).toContain('PUBLIC_VARIABLE:42-public|');
    expect(secretsServer).toContain('PRIVATE_VARIABLE:42-private|');
    const secretsClient = await page.textContent('.secrets-client');
    expect(secretsClient).toContain('PUBLIC_VARIABLE:42-public|');
    expect(secretsClient).toContain('PRIVATE_VARIABLE:|'); // Missing private var in client bundle
  });

  it('has access to request context', async () => {
    await page.goto(getServerUrl() + '/request-context');
    expect(await page.textContent('h1')).toContain('Request Context');

    const defaultContext = await page.textContent('#default-context');
    expect(defaultContext).toContain('{"test1":true}');
    const scopedContext = await page.textContent('#scoped-context');
    expect(scopedContext).toContain('{"test2":true}');
  });

  it.skip('should render server props in client component', async () => {
    await page.goto(getServerUrl() + '/test-server-props');
    expect(await page.textContent('#server-props')).toMatchInlineSnapshot(
      `"props: {}"`
    );

    await page.click('#update-server-props');
    await page.waitForSelector('#server-props-with-data', {timeout: 35000});

    expect(
      await page.textContent('#server-props-with-data')
    ).toMatchInlineSnapshot(`"props: {\\"hello\\":\\"world\\"}"`);

    // Navigate events should clear the server props
    await Promise.all([page.click('#navigate'), page.waitForNavigation()]);
    await page.waitForSelector('#server-props', {timeout: 35000});
    expect(await page.textContent('#server-props')).toMatchInlineSnapshot(
      `"props: {}"`
    );
  }, 35000);

  it('streams the SSR response and includes RSC payload', async () => {
    const response = await fetch(getServerUrl() + '/stream');
    const streamedChunks = [];

    // This fetch response is not standard but a node-fetch polyfill.
    // Therefore, the body is not a ReadableStream but a Node Readable.
    // @ts-ignore
    for await (const chunk of response.body) {
      streamedChunks.push(chunk.toString());
    }

    expect(streamedChunks.length).toBeGreaterThan(1); // Streamed more than 1 chunk

    const body = streamedChunks.join('');
    expect(body).toContain(
      `<meta data-flight="${htmlEncode('S1:"react.suspense"')}`
    );
    expect(body).toContain('<div c="5">');
    expect(body).toContain('>footer!<');
  });

  it('buffers HTML for bots', async () => {
    const response = await fetch(getServerUrl() + '/stream?_bot');
    const streamedChunks = [];

    // This fetch response is not standard but a node-fetch polyfill.
    // Therefore, the body is not a ReadableStream but a Node Readable.
    // @ts-ignore
    for await (const chunk of response.body) {
      streamedChunks.push(chunk.toString());
    }

    expect(streamedChunks.length).toEqual(1); // Did not stream because it's a bot

    const body = streamedChunks.join('');
    expect(body).toContain(
      `<meta data-flight="${htmlEncode('S1:"react.suspense"')}`
    );
    expect(body).toContain('<div c="5">');
    expect(body).toContain('>footer!<');
  });

  it('buffers HTML for custom bot', async () => {
    const response = await fetch(getServerUrl() + '/stream', {
      headers: {
        'user-agent': 'custom bot',
      },
    });
    const streamedChunks = [];

    // This fetch response is not standard but a node-fetch polyfill.
    // Therefore, the body is not a ReadableStream but a Node Readable.
    // @ts-ignore
    for await (const chunk of response.body) {
      streamedChunks.push(chunk.toString());
    }

    expect(streamedChunks.length).toEqual(1); // Did not stream because it's a bot

    const body = streamedChunks.join('');
    expect(body).toContain('<div c="5">');
    expect(body).toContain('>footer!<');
  });

  it('buffers the RSC response', async () => {
    const response = await fetch(
      getServerUrl() +
        `${RSC_PATHNAME}?state=` +
        encodeURIComponent(JSON.stringify({pathname: '/stream'}))
    );

    const streamedChunks = [];

    // This fetch response is not standard but a node-fetch polyfill.
    // Therefore, the body is not a ReadableStream but a Node Readable.
    // @ts-ignore
    for await (const chunk of response.body) {
      streamedChunks.push(chunk.toString());
    }

    expect(streamedChunks.length).toBe(1);

    const body = streamedChunks.join('');
    expect(body).toContain('S1:"react.suspense"');
    expect(body).toContain('"c":"5","children":"done"');
  });

  it('shows SEO tags for bots', async () => {
    const response = await fetch(getServerUrl() + '/seo?_bot');
    const body = await response.text();

    expect(body).toContain('<html lang="ja">');
    // Overwrites "class" and appends "data-test"
    expect(body).toContain(
      '<body data-my-attr=" some spaces here " class="pb-2" data-style="color: red" data-test="true">'
    );
    expect(body).toMatch(
      /<meta\s+.*?property="og:url"\s+content="example.com"\s*\/>/
    );
    // This one comes after Suspense delay
    expect(body).toMatch(
      /<meta\s+.*?property="type"\s+content="website"\s*\/>/
    );
  });

  it('returns headers in response correctly', async () => {
    const response = await fetch(getServerUrl() + '/headers');

    expect(response.status).toEqual(201);
    // statusText cannot be modified in workers
    expect(response.statusText).toEqual(isWorker ? 'Created' : 'hey');
    expect(response.headers.get('Accept-Encoding')).toBe('deflate, gzip');
    expect(response.headers.raw()['set-cookie']).toEqual([
      'hello=world',
      'hello2=world2',
    ]);
  });

  it('returns powered-by header', async () => {
    const response = await fetch(getServerUrl() + '/');
    expect(response.headers.get('powered-by')).toBe('Shopify-Hydrogen');
  });

  it('properly escapes props in the SSR flight script chunks', async () => {
    await page.goto(getServerUrl() + '/escaping');
    expect(await page.textContent('body')).toContain(
      "</script><script>alert('hi')</script>"
    );
    expect(await page.textContent('body')).toContain(`"fiddle"`);
  });

  it('imports components using aliases', async () => {
    await page.goto(getServerUrl() + '/alias');
    expect(await page.textContent('h1')).toContain('Aliases');

    expect(await page.$$('[data-test=alias]')).toHaveLength(3);
  });

  it('adds style tags for CSS modules', async () => {
    await page.goto(getServerUrl() + '/css-modules');
    expect(await page.textContent('h1')).toContain('CSS Modules');

    // Same class for the same style
    const className = await page.getAttribute('[data-test=server]', 'class');
    expect(className).toMatch(/^_red_/);
    expect(await page.getAttribute('[data-test=client]', 'class')).toEqual(
      className
    );

    // Style tag is present in DOM
    expect(await page.textContent('style')).toEqual(
      `.${className} {\n  color: red;\n}\n`
    );
  });

  it('supports React.useId()', async () => {
    const response = await page.goto(getServerUrl() + '/useid');

    // Pattern: <div id="id">:Rcm:</div>
    const serverRenderedId = (await response.text()).match(
      /<div id="id">(.*?)<\/div>/
    )[1];

    const clientRenderedId = await page.evaluate(() => {
      return document.getElementById('id').innerHTML;
    });

    expect(serverRenderedId).toEqual(clientRenderedId);
  });

  describe('HMR', () => {
    if (isBuild) return;

    it('updates the contents when a client component file changes', async () => {
      const fullPath = resolve(
        __dirname,
        '../',
        'src/components/Counter.client.jsx'
      );
      const newButtonText = 'add';

      await page.goto(getServerUrl() + '/about');

      await edit(
        fullPath,
        (code) => code.replace('increase count', newButtonText),
        () => untilUpdated(() => page.textContent('button'), 'increase count'),
        () => untilUpdated(() => page.textContent('button'), newButtonText)
      );
    });

    it('updates the contents when a server component file changes', async () => {
      const fullPath = resolve(__dirname, '../', 'src/routes/index.server.jsx');
      const newheading = 'Snow Devil';

      await page.goto(getServerUrl());

      await edit(
        fullPath,
        (code) => code.replace('<h1>Home', `<h1>${newheading}`),
        () => untilUpdated(() => page.textContent('h1'), 'Home'),
        () => untilUpdated(() => page.textContent('h1'), newheading)
      );
    });
  });

  describe('API Routing', () => {
    it('should support API route on a server component for POST methods', async () => {
      const response = await page.request.post(getServerUrl() + '/', {
        headers: {
          Accept: 'text/plain',
        },
      });
      const text = await response.text();

      expect(response.status()).toBe(200);
      expect(text).toEqual('some api response');
    });

    it('should support API route on a server component for PUT methods', async () => {
      const response = await page.request.put(getServerUrl() + '/', {
        headers: {
          Accept: 'text/plain',
        },
      });
      const text = await response.text();

      expect(response.status()).toBe(200);
      expect(text).toEqual('some api response');
    });

    it('should support API route on a server component for PATCH methods', async () => {
      const response = await page.request.patch(getServerUrl() + '/', {
        headers: {
          Accept: 'text/plain',
        },
      });
      const text = await response.text();

      expect(response.status()).toBe(200);
      expect(text).toEqual('some api response');
    });

    it('should support API route on a server component for DELETE methods', async () => {
      const response = await page.request.delete(getServerUrl() + '/', {
        headers: {
          Accept: 'text/plain',
        },
      });
      const text = await response.text();

      expect(response.status()).toBe(200);
      expect(text).toEqual('some api response');
    });

    it('should support API route on a server component for HEAD methods', async () => {
      const response = await page.request.head(getServerUrl() + '/', {
        headers: {
          Accept: 'text/plain',
        },
      });
      const text = await response.text();

      expect(response.status()).toBe(200);
    });

    it('should GET data from an API route', async () => {
      const response = await page.request.get(getServerUrl() + '/comments', {
        headers: {
          Accept: 'application/json',
        },
      });
      const json = await response.json();

      expect(response.status()).toBe(200);
      expect(json).toEqual([{id: 0, value: 'some comment'}]);
    });

    it('should GET by a route parameter', async () => {
      const response = await page.request.get(getServerUrl() + '/comments/0', {
        headers: {
          Accept: 'application/json',
        },
      });
      const json = await response.json();

      expect(response.status()).toBe(200);
      expect(json).toEqual({id: 0, value: 'some comment'});
    });

    it('should POST data to an API route', async () => {
      const response = await page.request.post(getServerUrl() + '/comments', {
        data: JSON.stringify({
          value: 'new comment',
        }),
        headers: {
          Accept: 'application/json',
        },
      });
      const json = await response.json();

      expect(response.status()).toBe(200);
      expect(json).toEqual({id: 1, value: 'new comment'});
    });

    it('should DELETE an API route', async () => {
      const response = await page.request.delete(getServerUrl() + '/comments', {
        headers: {
          Accept: 'application/json',
        },
      });
      expect(response.status()).toBe(204);
      expect(response.statusText()).toBe('No Content');
    });

    it('should return 404 on unknown method', async () => {
      const response = await page.request.patch(getServerUrl() + '/comments', {
        data: JSON.stringify({}),
        headers: {
          Accept: 'application/json',
        },
      });

      const text = await response.text();

      expect(response.status()).toBe(405);
      expect(response.statusText()).toBe('Method Not Allowed');
      expect(text).toBe('Comment method not found');
    });

    it('should support simple strings returned from API routes', async () => {
      const response = await page.request.get(getServerUrl() + '/string');
      const text = await response.text();

      expect(response.status()).toBe(200);
      expect(text).toBe('some string');
    });

    it('should support objects as json returned from API routes', async () => {
      const response = await page.request.get(getServerUrl() + '/json');
      const json = await response.json();

      expect(response.status()).toBe(200);
      expect(json).toEqual({some: 'json'});
    });

    it('should support queryShop in API functions', async () => {
      const response = await page.request.get(
        getServerUrl() + '/api-queryshop'
      );
      const data = await response.json();

      expect(response.status()).toBe(200);
      expect(data).toEqual({
        data: {shop: {id: 'gid://shopify/Shop/55145660472'}},
      });
    });

    it('supports form request on API routes', async () => {
      await page.goto(getServerUrl() + '/form');
      await page.type('#fname', 'sometext');
      await page.click('#fsubmit');
      expect(await page.textContent('*')).toContain('fname=sometext');
    });

    it('can concatenate requests', async () => {
      await page.goto(getServerUrl() + '/html-form');
      expect(await page.textContent('#counter')).toEqual('0');
      await page.click('#increase');
      expect(await page.textContent('#counter')).toEqual('1');
      await page.click('#increase');
      expect(await page.textContent('#counter')).toEqual('2');
    });
  });

  describe('Custom Routing', () => {
    it('loads a custom route', async () => {
      await page.goto(getServerUrl() + '/custom1');
      expect(await page.textContent('h1')).toContain('Custom 1');
    });

    it('loads a custom route with params', async () => {
      await page.goto(getServerUrl() + '/custom2/someParam');
      expect(await page.textContent('h1')).toContain('Custom 2: someParam');
    });

    it('loads a child within children', async () => {
      await page.goto(getServerUrl() + '/custom3');
      expect(await page.textContent('h1')).toContain('Custom 1');
    });

    it('loads a route rendered by a component', async () => {
      await page.goto(getServerUrl() + '/custom4');
      expect(await page.textContent('h1')).toContain('Custom 1');
    });

    it('loads a route lazily defined', async () => {
      await page.goto(getServerUrl() + '/lazyRoute');
      expect(await page.textContent('#root')).toContain('Lazy Route');
    });

    it('loads params via `useRouteParams()` in server components', async () => {
      await page.goto(getServerUrl() + '/params/somevalue');
      expect(await page.textContent('#serverParams')).toContain(
        'Server Component: somevalue'
      );
    });

    it('loads params via `useRouteParams()` in client components', async () => {
      await page.goto(getServerUrl() + '/params/somevalue');
      expect(await page.textContent('#clientParams')).toContain(
        'Client Component: somevalue'
      );
    });
  });

  describe('Sessions', () => {
    it('creates a session', async () => {
      const response = await fetch(getServerUrl() + '/sessions/writeSession', {
        method: 'POST',
        body: JSON.stringify({
          someData: 'some value',
        }),
        headers: {
          Accept: 'application/json',
        },
      });

      const text = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get('Set-Cookie')).toBe(
        '__session=%7B%22someData%22%3A%22some%20value%22%7D; Expires=Sun, 08 Jun 2025 00:39:38 GMT'
      );
      expect(text).toEqual('Session Created');
    });

    it('deletes a session', async () => {
      const response = await fetch(getServerUrl() + '/sessions/writeSession', {
        method: 'DELETE',
        headers: {
          cookie: '__session=%7B%22someData%22%3A%22some%20value%22%7D',
        },
      });

      const text = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get('Set-Cookie')).toBe(
        '__session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      );
      expect(text).toEqual('Session Destroyed');
    });

    it('gets data from a session', async () => {
      const response = await fetch(getServerUrl() + '/sessions/writeSession', {
        headers: {
          cookie: '__session=%7B%22someData%22%3A%22some%20value%22%7D',
        },
      });

      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toMatchInlineSnapshot(`"{\\"someData\\":\\"some value\\"}"`);
    });

    it('gets data from a session with RSC', async () => {
      const response = await fetch(getServerUrl() + '/sessions/readSession', {
        headers: {
          cookie: '__session=%7B%22someData%22%3A%22some%20value%22%7D',
        },
      });

      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toContain(`some value`);
    });
  });
}
