import {paramCase} from 'change-case';
import {resolve, dirname, sep, join, extname} from 'path';
import {
  TestContext,
  it as vitestIt,
  describe as vitestDescribe,
  beforeAll as vitestBeforeAll,
  afterAll as vitestAfterAll,
  beforeEach as vitestBeforeEach,
  expect,
} from 'vitest';
import {
  readFile,
  mkdirp,
  writeFile,
  pathExists,
  emptyDir,
  remove,
  copy,
} from 'fs-extra';
import debug from 'debug';
import {
  InlineConfig,
  createServer as createViteServer,
  loadEnv as viteLoadEnv,
  build as viteBuild,
} from 'vite';
import {chromium} from 'playwright';
import type {Browser, Page} from 'playwright';
import {format as prettierFormat} from 'prettier';
import getPort from 'get-port';
import {Miniflare} from 'miniflare';

interface Context {
  fs: SandboxFileSystem;
  instance: SandboxInstance;
  browser: SandboxBrowser;
  it: any;
}

type Mode = 'node-prod' | 'worker-prod' | 'node-dev';

interface SandboxOptions {
  debug?: boolean;
  persist?: boolean;
  modes?: Mode[];
  routes?: Record<
    string,
    () => Promise<{
      [key: string]: any;
    }>
  >;
}

const log = debug('hydrogen:test');

const DefaultOptions = {
  modes: ['node-dev', 'node-prod', 'worker-prod'] as Mode[],
};

export function describe(
  name: string,
  runner: (context: Context & Omit<TestContext, 'error'>) => void,
  options: SandboxOptions = DefaultOptions
) {
  const {routes, modes = DefaultOptions.modes} = options;
  const root = join(__dirname, paramCase(name));
  const directory = join(root, 'fixture');
  const fs = new SandboxFileSystem(directory, options);
  const instance = new SandboxInstance(directory, options);
  const browser = new SandboxBrowser(options);

  const it = (name: string, runner: (mode: string) => void) => {
    vitestIt.each(modes)(`[%s] ${name}`, runner);
  };

  vitestDescribe(name, async (context: TestContext) => {
    await addRoutesToFixture(root, routes);

    await vitestDescribe.each(modes)('[%s] routes', async (mode) => {
      vitestBeforeAll(async () => {
        await fs.init();
        await instance.init(mode);
      });

      vitestBeforeEach(async () => {
        await browser.open(instance.servers[mode].url());
      });

      vitestBeforeEach(async () => {
        await browser.close();
      });

      const routeEntries = Object.entries(routes);

      if (!routeEntries.length) {
        vitestIt('ping', async () => {
          await browser.navigate('/ping');
          expect(await browser.text('div')).toBe('PONG');
        });
      }

      for (const route of routeEntries) {
        const [name, module] = route;
        const tests = (await module()).tests;

        await tests({
          expect,
          it: vitestIt,
          browser,
          instance,
          name,
          mode,
          ...context,
        });
      }
    });

    await runner({fs, it, browser, instance, ...context});

    vitestAfterAll(async () => {
      if (!options.persist) {
        await browser.close();
        await instance.destroy();
        await fs.cleanup();
      }
    });
  });
}

export class SandboxFileSystem {
  debug?: boolean;
  initialized?: boolean;
  files: Map<string, string> = new Map();

  constructor(public readonly root: string, options: SandboxOptions = {}) {
    this.debug = options.debug;

    log(`Creating sandbox filesystem at ${root} ${options.debug}`);

    mkdirp(this.root);
  }

  async init() {
    const paths = this.root.split('/');
    const name = paths[paths.length - 2];
    writeFile(join(this.root, '.gitignore'), '*');
    writeFile(
      join(this.root, 'package.json'),
      JSON.stringify(
        {
          name: `@fixture/${name}`,
          private: true,
          version: '0.0.0',
          devDependencies: {
            vite: '^3.0.0',
          },
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
          },
        },
        null,
        2
      )
    );

    mkdirp(join(this.root, 'public'));
    mkdirp(join(this.root, 'src', 'routes'));
    writeFile(
      join(this.root, 'src', 'routes', 'ping.server.jsx'),
      `
        export default function Ping() {
          return <div>PONG</div>;
        }
    `
    );

    this.initialized = true;
  }

  private resolvePath(...parts: string[]) {
    return resolve(this.root, ...parts);
  }

  async write(
    file: string | [string, ((a: any) => string) | string][],
    contents?: ((a: any) => string) | string
  ) {
    if (Array.isArray(file)) {
      for (const [filePath, contents] of file) {
        await this.write(filePath, contents);
      }
      return;
    }

    const filePath = this.resolvePath(file);
    const content = contents instanceof Function ? contents(file) : contents;
    const formattedContent = await this.format(filePath, content);

    await mkdirp(dirname(filePath));

    if (this.initialized) {
      this.files.set(filePath, formattedContent);
    }

    await writeFile(filePath, formattedContent, {encoding: 'utf8'});
  }

  async reset() {
    for (const [filePath] of Array.from(this.files.entries())) {
      await remove(filePath);
    }
  }

  async edit(file: string) {
    // TODO move our utility for this over to the sandbox instance
  }

  async read(file: string) {
    const filePath = this.resolvePath(file);
    return readFile(filePath, 'utf8');
  }

  async exists(file: string) {
    const filePath = this.resolvePath(file);
    return pathExists(filePath);
  }

  async cleanup() {
    await emptyDir(this.root);
    await remove(this.root);
  }

  async format(path, content) {
    if (!this.debug) {
      return content;
    }

    const ext = extname(path);
    const prettierConfig = {
      arrowParens: 'always' as const,
      singleQuote: true,
      bracketSpacing: false,
      trailingComma: 'all' as const,
      parser: 'babel',
    };

    switch (ext) {
      case '.md':
        prettierConfig.parser = 'markdown';
        break;
      case '.html':
      case '.svg':
        prettierConfig.parser = 'html';
        break;
      case '.json':
      case '.css':
        prettierConfig.parser = ext.slice(1);
        break;
    }

    const formattedContent = await prettierFormat(content, prettierConfig);

    return formattedContent;
  }
}

interface Server {
  url: string;
  close: () => Promise<void>;
}

// Instance
export class SandboxInstance {
  debug?: boolean;
  servers: Server[] = [];

  constructor(public readonly root: string, options: SandboxOptions = {}) {
    this.debug = options.debug;

    log(`Creating sandbox instance at ${root}`);
  }

  async init(mode: Mode) {
    log(`Initiating SandboxInstance in ${mode}`);

    await this.mount(mode, async ({port, ip}) => {
      const config = {
        port,
        ip,
        watch: false,
        root: this.root,
        mode,
      };

      let server;

      try {
        switch (mode) {
          case 'node-dev':
            server = await createNodeDevServer(config);

            break;
          case 'worker-prod':
            await build(config);
            server = await createWorkerProdServer(config);

            break;
          case 'node-prod':
            await build(config);
            server = await createNodeProdServer(config);

            break;
          default:
            throw new Error(`Unknown mode: ${mode}`);
        }
      } catch (error) {
        throw new Error(
          `Error during ${mode} instantiation. This indicates a problem with the test fixture during build and/or serve. 
          ${error}`
        );
      }
      return server;
    });
  }

  async mount(mode, mountFunction: ({port: number, ip: string}) => any) {
    const port = await getPort();
    const ip = 'http://localhost';
    const url = () => `${ip}:${port}`;

    const server = await mountFunction({port, ip});

    this.servers[mode] = {...server, url};
  }

  async destroy() {
    this.servers.forEach((server) => {
      server.close();
    });
  }
}

export class SandboxBrowser {
  page: Page;
  chrome: Browser;
  debug?: boolean;

  constructor(public readonly options: SandboxOptions = {}) {
    this.debug = options.debug;
  }

  async open(url: string) {
    this.chrome = await chromium.launch({
      headless: !this.debug,
      slowMo: this.debug ? 2000 : 0,
      devtools: this.debug,
      args: process.env.CI
        ? ['--no-sandbox', '--disable-setuid-sandbox']
        : undefined,
    });

    this.page = await this.chrome.newPage({baseURL: url});
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async navigate(url: string) {
    await this.page.goto(url);
  }

  async text(selector: string) {
    await this.page.waitForSelector(selector);

    const text = await this.page.evaluate(
      (querySelector) => document.querySelector(querySelector)?.textContent,
      selector
    );

    return text;
  }

  url() {
    return this.page.url();
  }

  async close() {
    this.chrome?.close();
  }
}

interface BuildConfig {
  root: string;
  mode: Mode;
}

interface ServerConfig extends BuildConfig {
  port?: number;
  ip?: string;
}

async function createWorkerProdServer({root, port}: ServerConfig) {
  const mf = new Miniflare({
    scriptPath: resolve(root, 'dist/worker/index.js'),
    sitePath: resolve(root, 'dist/client'),
    bindings: await loadEnv(root),
  });

  const app = mf.createServer();

  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(port, () => {
        resolve({
          async close() {
            await new Promise((resolve) => {
              server.close(resolve);
            });
          },
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function createNodeProdServer({port, root}: ServerConfig) {
  const env = await loadEnv(root);

  Object.assign(process.env, env);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const {createServer} = require(join(root, 'dist', 'node'));

  const {app} = await createServer({cwd: root});

  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(port, () => {
        resolve({
          async close() {
            await new Promise((resolve) => {
              server.close(resolve);
            });
          },
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function createNodeDevServer({port, ip, root}) {
  const server = await createViteServer({
    root,
    logLevel: 'silent',
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
      host: true,
      port,
    },
  });

  await server.listen();

  return {
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.httpServer?.close((error) =>
          error ? reject(error) : resolve()
        );
      }),
  };
}

async function build({root, mode}: BuildConfig) {
  log('building', mode, root);

  const entries: Record<Mode, string | boolean> = {
    'node-prod': `@shopify/hydrogen/platforms/node`,
    'worker-prod': `@shopify/hydrogen/platforms/worker-event`,
    'node-dev': false,
  };

  const entry = entries[mode];

  if (!entry) {
    return;
  }

  const targets = {
    client: async () =>
      !(await pathExists(join(root, 'dist', 'client', 'index.html'))),
    worker: mode === 'worker-prod' ? entry : false,
    node: mode === 'node-prod' ? entry : false,
  };

  for (const [key, value] of Object.entries(targets)) {
    log(key, value);

    const ssr = typeof value === 'function' ? await value() : value;

    if (!ssr) {
      continue;
    }

    if (key === 'worker') {
      process.env.WORKER = 'true';
    }

    const config: InlineConfig = {
      root,
      logLevel: 'silent',
      build: {
        outDir: `dist/${key}`,
        ssr: typeof ssr === 'string' ? ssr : undefined,
        manifest: key === 'client',
      },
    };

    await viteBuild(config);
  }
}

async function addRoutesToFixture(root, routes) {
  for (const route of Object.entries(routes)) {
    const [name] = route;
    const source = join(root, name);
    const paths = source.split(sep);
    const routesIndex = paths.indexOf('routes');
    const dest = [
      ...paths.slice(0, routesIndex),
      'fixture',
      'src',
      'routes',
      ...paths.slice(routesIndex + 1),
    ].join(sep);

    await copy(source, dest);
  }
}

async function loadEnv(root) {
  const env = await viteLoadEnv('production', root, '');
  Object.keys(env).forEach((key) => {
    if (['VITE_', 'PUBLIC_'].some((prefix) => key.startsWith(prefix))) {
      delete env[key];
    }
  });

  return env;
}

export const MINIMAL_TEMPLATE: [string, ((a: any) => string) | string][] = [
  [
    'index.html',
    ({title}) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title || 'Hydrogen App'}</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/@shopify/hydrogen/entry-client"></script>
      </body>
    </html>
  `,
  ],

  [
    'vite.config.js',
    () =>
      `
    import {defineConfig} from 'vite';
    import hydrogen from '@shopify/hydrogen/plugin';

    export default defineConfig({
      plugins: [hydrogen()],
    });

  `,
  ],

  [
    'hydrogen.config.js',
    () => `
    import {defineConfig} from '@shopify/hydrogen/config';

    export default defineConfig({
      shopify: {
        storeDomain: 'hydrogen-preview.myshopify.com',
        storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
        storefrontApiVersion: '2022-07',
      },
      logger: {
        trace: () => {},
        debug: () => {},
        warn: () => {},
        error: () => {},
        fatal: () => {},
      }
    });
  `,
  ],
  [
    'src/App.Server.jsx',
    () => `
    import React from 'react';
    import renderHydrogen from '@shopify/hydrogen/entry-server';
    import {Router, FileRoutes, ShopifyProvider} from '@shopify/hydrogen';
    import {Suspense} from 'react';

    function App() {
      return (
        <Suspense fallback={null}>
          <ShopifyProvider>
            <Router>
              <FileRoutes />
            </Router>
          </ShopifyProvider>
        </Suspense>
      );
    }

    export default renderHydrogen(App);
  `,
  ],
];
