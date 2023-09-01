import {RSC_PATHNAME} from '../../../hydrogen/src/constants';
import {htmlEncode} from '../../../hydrogen/src/utilities';
import fetch from 'node-fetch';
import {resolve} from 'path';
import type {Browser, Page} from 'playwright';

declare global {
  const browser: Browser;
}

import {edit, untilUpdated} from '../../utilities';

type TestOptions = {
  getServerUrl: () => string;
  isWorker?: boolean;
  isBuild?: boolean;
};

const SHOPIFY_ANALYTICS_ENDPOINT =
  'https://monorail-edge.shopifysvc.com/unstable/produce_batch';
const SHOPIFY_PERFORMANCE_ENDPOINT =
  'https://monorail-edge.shopifysvc.com/v1/produce';

export default async function testCases({
  getServerUrl,
  isBuild,
  isWorker,
}: TestOptions) {
  let page: Page;
  beforeEach(async () => {
    page && (await page.close());
    page = await browser.newPage();
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

  it('decodes non UTF-8 parameters', async () => {
    await page.goto(getServerUrl() + '/encode-uri/送料無料対象商品');

    expect(await page.textContent('h1')).toContain('Encode URI');
    expect(await page.textContent('#encode-uri-content')).toMatch(
      '送料無料対象商品'
    );
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

  it('responds with error when RSC state is invalid', async () => {
    const response = await fetch(getServerUrl() + '/__rsc?state=invalid{state');
    expect(response.status).toEqual(400);
  });

  it.skip('should render server props in client component', async () => {
    await page.goto(getServerUrl() + '/test-server-props');
    expect(await page.textContent('#server-props')).toMatchInlineSnapshot(
      `"props: {}"`
    );

    await page.click('#update-server-props');

    expect(
      await page.textContent('#server-props-with-data')
    ).toMatchInlineSnapshot(`"props: {\\"hello\\":\\"world\\"}"`);

    // // Navigate events should clear the server props
    page.on('request', (request) => {
      try {
        expect(request.url()).toContain(
          '__rsc?state=%7B%22pathname%22%3A%22%2Ftest-server-props%22%2C%22search%22%3A%22%3Frefresh%22%7D'
        );
      } catch (e) {
        fail(e);
      }
    });
    await Promise.all([page.click('#navigate'), page.waitForNavigation()]);
    expect(await page.textContent('#server-props')).toMatchInlineSnapshot(
      `"props: {}"`
    );
  });

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

  it('streams if server component calls doNotStream after stream has already started', async () => {
    const response = await fetch(getServerUrl() + '/midwaynostream');
    const streamedChunks = [];

    // This fetch response is not standard but a node-fetch polyfill.
    // Therefore, the body is not a ReadableStream but a Node Readable.
    // @ts-ignore
    for await (const chunk of response.body) {
      streamedChunks.push(chunk.toString());
    }

    const body = streamedChunks.join('');
    expect(body).toContain('Call doNotStream after stream has already begun');
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
    expect(response.headers.get('powered-by')).toBe('Shopify, Hydrogen');
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

  describe('CSS', () => {
    const extractCssFromDOM = async () => {
      if (isBuild) {
        // Downloaded using a link tag
        const linkTags = await page
          .locator('link[rel=stylesheet]')
          .elementHandles();

        expect(linkTags).toHaveLength(1); // Styles aren't duplicated

        const href = await linkTags[0].getAttribute('href');

        return await (await fetch(getServerUrl() + href)).text();
      } else {
        // Inlined in the DOM using JS for HMR
        return (await page.locator('style').allTextContents()).join('\n');
      }
    };

    it('adds style tags for pure CSS', async () => {
      await page.goto(getServerUrl() + '/css-pure');
      expect(await page.textContent('h1')).toContain('CSS Pure');

      // Same class for the same style
      const className = await page.getAttribute('[data-test=server]', 'class');
      expect(className).toEqual('green');

      // Style is present in DOM
      expect(await extractCssFromDOM()).toMatch(
        /\.green\s*{\s*color:\s*green;?\s*/m
      );
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

      // Style is present in DOM
      expect(await extractCssFromDOM()).toMatch(
        new RegExp(`\\.${className}\\s*{\\s*color:\\s*red;?\\s*}`, 'm')
      );
    });

    if (isBuild) {
      it('preloads stylesheets', async () => {
        const response = await page.request.get(
          getServerUrl() + '/css-modules'
        );
        const html = await response.text();
        const {link} = response.headers();

        expect(link).toMatch(
          /<\/assets\/style.[\w\d]+.css>; rel=preload; as=style/
        );

        const assets = (html.match(/<link[^<>]+?>/gim) || [])
          .filter((linkTag) => linkTag.includes('rel="stylesheet"'))
          .map((linkTag) => linkTag.match(/href="([^"]+)"/)?.[1] || '');

        for (const asset of assets) {
          expect(link).toMatch(asset);
        }
      });
    }
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
      expect(await page.textContent('h1')).toContain('About');

      await page.click('.increase');
      expect(await page.textContent('.count')).toBe('Count is 1');

      await edit(
        fullPath,
        (code) => code.replace('increase count', newButtonText),
        () => untilUpdated(() => page.textContent('button'), 'increase count'),
        () => untilUpdated(() => page.textContent('button'), newButtonText)
      );

      // Only refreshes the client component without changing input state
      expect(await page.textContent('.count')).toBe('Count is 1');
    });

    it('updates the contents when a server component file changes', async () => {
      const fullPath = resolve(__dirname, '../', 'src/routes/about.server.jsx');
      const newheading = 'Snow Devil';

      await page.goto(getServerUrl() + '/about');
      expect(await page.textContent('h1')).toContain('About');

      await page.click('.increase');
      expect(await page.textContent('.count')).toBe('Count is 1');

      await edit(
        fullPath,
        (code) => code.replace('<h1>About', `<h1>${newheading}`),
        () => untilUpdated(() => page.textContent('h1'), 'About'),
        () => untilUpdated(() => page.textContent('h1'), newheading)
      );

      // Full page refresh
      expect(await page.textContent('.count')).toBe('Count is 0');
    });

    it('updates the contents when a CSS module file changes', async () => {
      const redRgb = 'rgb(255, 0, 0)';
      const darkredRbg = 'rgb(139, 0, 0)';
      const fullPath = resolve(__dirname, '../', 'src/style.module.css');

      await page.goto(getServerUrl() + '/css-modules');
      expect(await page.textContent('h1')).toContain('CSS Modules');

      const getElementColor = async (type) => {
        const element = await page.waitForSelector(`[data-test=${type}]`);
        return element.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue('color')
        );
      };

      expect(await page.textContent('.count')).toBe('Count is 0');
      await page.click('.increase');
      expect(await page.textContent('.count')).toBe('Count is 1');

      expect(await getElementColor('server')).toEqual(redRgb);
      expect(await getElementColor('client')).toEqual(redRgb);

      await edit(
        fullPath,
        (code) => code.replace('color: red', 'color: darkred'),
        () => untilUpdated(() => getElementColor('server'), redRgb),
        async () => {
          await untilUpdated(() => getElementColor('server'), darkredRbg);

          // Only refreshes the CSS Module without changing input state
          expect(await page.textContent('.count')).toBe('Count is 1');
        }
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

    it('can concatenate form requests', async () => {
      await page.goto(getServerUrl() + '/html-form');
      expect(await page.textContent('#counter')).toEqual('0');
      await page.click('#increase');
      expect(await page.textContent('#counter')).toEqual('1');
      await page.click('#increase');
      expect(await page.textContent('#counter')).toEqual('2');
    });

    it('can concatenate requests', async () => {
      await page.goto(getServerUrl() + '/concatenate');
      expect(await page.textContent('body')).toContain('About');
    });

    it('responds with RSC', async () => {
      const response = await page.request.post(getServerUrl() + '/account', {
        data: `username=alincoln%40example.com&password=somepass`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Hydrogen-Client': 'Form-Action',
        },
      });
      const text = await response.text();

      expect(response.status()).toBe(200);
      expect(text.split('\n')[0]).toBe('S1:"react.suspense"');
      expect(text).toContain('["Welcome ","alincoln@example.com","!"]');
    });

    it('responds with RSC pathname header', async () => {
      const response = await page.request.post(getServerUrl() + '/account', {
        data: `action=logout`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Hydrogen-Client': 'Form-Action',
        },
      });
      const text = await response.text();

      expect(response.status()).toBe(200);
      expect(response.headers()['hydrogen-rsc-pathname']).toBe('/');
      expect(text.split('\n')[0]).toBe('S1:"react.suspense"');
      expect(text).toContain('Home');
    });

    it('responds with html content when submitted by a form', async () => {
      const response = await page.request.post(getServerUrl() + '/account', {
        data: `username=alincoln%40example.com&password=somepass`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      });
      expect(response.status()).toBe(200);
      const text = await response.text();

      expect(text).toContain('<!DOCTYPE html>');
      expect(text).toContain('alincoln@example.com');
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

    it('clears flash session data after read', async () => {
      const response = await fetch(getServerUrl() + '/sessions/flash', {
        headers: {
          cookie:
            '__session=%7B%22someData%22%3A%22some%20value%22%7D' +
            ';Hydrogen-Redirect=1',
        },
      });

      const text = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get('Set-Cookie')).toBe(
        '__session=%7B%7D; Expires=Sun, 08 Jun 2025 00:39:38 GMT'
      );
      expect(text).toContain(`some value`);
    });
  });

  describe('Shopify analytics', () => {
    it('should emit page-view event', async () => {
      const analyticFullPage = getServerUrl() + '/analytics/full';

      const [request] = await Promise.all([
        page.waitForRequest(SHOPIFY_ANALYTICS_ENDPOINT),
        page.goto(analyticFullPage),
      ]);

      const shopifyEvents = request.postDataJSON();
      expect(request.url()).toEqual(SHOPIFY_ANALYTICS_ENDPOINT);

      const event = shopifyEvents.events[0];
      const payload = event.payload;

      expect(event.schema_id).toContain('trekkie_storefront_page_view');
      expect(payload.url).toEqual(analyticFullPage);
      expect(payload.shopId).not.toEqual(0);
      expect(payload.pageType).toEqual('index');
      expect(payload.isMerchantRequest).toEqual(true);
    });

    it('should emit page-view on sub load', async () => {
      const analyticSubPage = '/analytics/sub';
      // Full load
      await Promise.all([
        page.waitForRequest(SHOPIFY_ANALYTICS_ENDPOINT),
        page.goto(getServerUrl() + '/analytics/full'),
      ]);

      // Sub load
      const [request] = await Promise.all([
        page.waitForRequest(SHOPIFY_ANALYTICS_ENDPOINT),
        page.click(`a[href="${analyticSubPage}"]`),
      ]);

      const shopifyEvents = request.postDataJSON();
      expect(request.url()).toEqual(SHOPIFY_ANALYTICS_ENDPOINT);

      const event = shopifyEvents.events[0];
      const payload = event.payload;

      expect(event.schema_id).toContain('trekkie_storefront_page_view');
      expect(payload.url).toEqual(getServerUrl() + analyticSubPage);
      expect(payload.shopId).not.toEqual(0);
      expect(payload.pageType).toEqual('page');
      expect(payload.isMerchantRequest).toEqual(true);
    });
  });

  describe('Performance metrics', () => {
    it('should emit performance event', async () => {
      const analyticFullPage = getServerUrl() + '/analytics/full';
      const [request] = await Promise.all([
        page.waitForRequest(SHOPIFY_PERFORMANCE_ENDPOINT),
        page.goto(analyticFullPage),
      ]);

      const performanceEvent = request.postDataJSON().payload;
      expect(request.url()).toEqual(SHOPIFY_PERFORMANCE_ENDPOINT);
      expect(performanceEvent.page_load_type).toEqual('full');
      expect(performanceEvent.url).toEqual(analyticFullPage);
    });

    it('should emit performance on sub load', async () => {
      const analyticSubPage = '/analytics/sub';
      // Full load
      await Promise.all([
        page.waitForRequest(SHOPIFY_PERFORMANCE_ENDPOINT),
        page.goto(getServerUrl() + '/analytics/full'),
      ]);

      // Sub load
      const [request] = await Promise.all([
        page.waitForRequest(SHOPIFY_PERFORMANCE_ENDPOINT),
        page.click(`a[href="${analyticSubPage}"]`),
      ]);

      const performanceEvent = request.postDataJSON().payload;
      expect(request.url()).toEqual(SHOPIFY_PERFORMANCE_ENDPOINT);
      expect(performanceEvent.page_load_type).toEqual('sub');
      expect(performanceEvent.url).toEqual(getServerUrl() + analyticSubPage);
    });
  });

  describe('Load 3rd-party scripts', () => {
    it('should load script in the body', async () => {
      await page.goto(getServerUrl() + '/loadscript/body', {
        waitUntil: 'networkidle',
      });

      expect(
        await page.$(
          'body > script[src="https://www.googletagmanager.com/gtag/js?id=UA-IN-BODY"]'
        )
      ).toBeTruthy();
    });

    it('should load script as module in the body', async () => {
      await page.goto(getServerUrl() + '/loadscript/body-module', {
        waitUntil: 'networkidle',
      });

      expect(
        await page.$(
          'body > script[src="https://www.googletagmanager.com/gtag/js?id=UA-IN-BODY-MODULE"]'
        )
      ).toBeTruthy();
    });

    it('should load script in the head', async () => {
      await page.goto(getServerUrl() + '/loadscript/head', {
        waitUntil: 'networkidle',
      });

      expect(
        await page.$(
          'head > script[src="https://www.googletagmanager.com/gtag/js?id=UA-IN-HEAD"]'
        )
      ).toBeTruthy();
    });

    it('should load script as a module in the head', async () => {
      await page.goto(getServerUrl() + '/loadscript/head-module', {
        waitUntil: 'networkidle',
      });

      expect(
        await page.$(
          'head > script[src="https://www.googletagmanager.com/gtag/js?id=UA-IN-HEAD-MODULE"]'
        )
      ).toBeTruthy();
    });
  });

  describe('Custom error apge', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('responds with a 500 and no cache headers', async () => {
      const response = await fetch(getServerUrl() + '/error');
      expect(response.status).toBe(500);
      expect(response.headers.get('cache-control')).toBe('no-store');
    });

    it('responds with a 500 and no cache headers for bots', async () => {
      const response = await fetch(getServerUrl() + '/error?_bot');
      expect(response.status).toBe(500);
      expect(response.headers.get('cache-control')).toBe('no-store');
    });

    it('responds with a 500 and no cache headers for bots on async pages', async () => {
      const response = await fetch(getServerUrl() + '/error-async?_bot');
      expect(response.status).toBe(500);
      expect(response.headers.get('cache-control')).toBe('no-store');
    });

    it('loads a custom error page', async () => {
      await page.goto(getServerUrl() + '/error');
      expect(await page.textContent('h1')).toContain('Custom Error Page');
      expect(await page.textContent('h2')).toContain('itBroke is not defined');
    });
  });
}
