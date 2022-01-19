import {resolve, dirname, join} from 'path';
import {paramCase} from 'change-case';
import {promisify} from 'util';
import {spawn, exec} from 'child_process';
import {
  readFile,
  mkdirp,
  writeFile,
  pathExists,
  emptyDir,
  remove,
} from 'fs-extra';
import playwright from 'playwright-chromium';
import {createServer as createNodeServer} from 'http';
import {
  createServer as createViteServer,
  build,
  ViteDevServer,
  UserConfig,
} from 'vite';
import sirv from 'sirv';
import getPort from 'get-port';

const INPUT_TIMEOUT = 500;
const execPromise = promisify(exec);

export type Command = 'create' | 'create component' | 'create page' | 'check';
type Input = Record<string, string | boolean | null>;

interface App {
  output: Result;
  withServer: (
    runner: (context: ServerContext) => Promise<void>
  ) => Promise<void>;
}
interface Context {
  fs: Sandbox;
  run(command: Command, input?: Input): Promise<App>;
}
interface Page {
  view(path: string): Promise<void>;
  screenshot(path: string): Promise<void>;
  textContent: playwright.Page['textContent'];
  click: playwright.Page['click'];
}

interface ServerContext {
  page: Page;
}

interface Server {
  start(directory: string): Promise<string>;
  stop(): Promise<void>;
}

interface Options {
  debug?: true;
}

interface ServerOptions extends Options {
  dev?: true;
}

export enum KeyInput {
  Down = '\x1B\x5B\x42',
  Up = '\x1B\x5B\x41',
  Enter = '\x0D',
  Space = '\x20',
  No = 'n',
  Yes = 'y',
}

const hydrogenCli = resolve(__dirname, '../../', 'bin', 'hydrogen');
const fixtureRoot = resolve(__dirname, '../fixtures');

export async function withCli(
  runner: (context: Context) => void,
  options?: Options
) {
  const name = paramCase(expect.getState().currentTestName);
  const directory = join(fixtureRoot, name);

  const fs = await createSandbox(directory);

  try {
    await runner({
      fs,
      run: async (command: Command, input: Input) => {
        const appName =
          input && typeof input.name === 'string' ? input.name : 'snow-devil';

        const result = await runCliCommand(directory, command, input);

        if (options?.debug) {
          console.log(result);
        }

        return {
          output: result,
          withServer: async function withServer(
            runner: (context: ServerContext) => Promise<void>,
            serverOptions?: ServerOptions
          ) {
            const launchOptions = serverOptions?.debug
              ? {
                  headless: false,
                }
              : {};
            let count = 1;

            const server = await createServer(serverOptions);
            const browser = await playwright.chromium.launch(launchOptions);
            const context = await browser.newContext();
            const playrightPage = await context.newPage();
            try {
              const appDirectory = join(directory, appName);
              await runInstall(appDirectory);

              const url = await server?.start(appDirectory);
              const page = {
                view: async (path: string) => {
                  const finalUrl = new URL(path, url);

                  await playrightPage.goto(finalUrl.toString());
                },
                screenshot: async (suffix?: string) => {
                  await playrightPage.screenshot({
                    path: `artifacts/${count++}-${name}${
                      suffix ? `-${suffix}` : ''
                    }.png`,
                  });
                },
                textContent: (el: string) => playrightPage.textContent(el),
                click: (el: string) => playrightPage.click(el),
              };

              await runner({page});
            } finally {
              await browser.close();
              await context.close();
              await playrightPage.close();
              await server.stop();
            }
          },
        };
      },
    });
  } catch (error) {
    console.log(error);
    if (!options?.debug) {
      await fs.cleanup();
    }
  } finally {
    if (!options?.debug) {
      await fs.cleanup();
    }
  }
}

async function createSandbox(directory: string) {
  await mkdirp(directory);
  await writeFile(join(directory, '.gitignore'), '*');

  return new Sandbox(directory);
}

async function runCliCommand(
  directory: string,
  command: Command,
  input: Input
): Promise<Result> {
  const result = new Result();
  const userInput = inputFrom(input, command);
  const childProcess = await spawn(hydrogenCli, command.split(' '), {
    cwd: directory,
    env: {...process.env},
  });

  return new Promise((resolve, reject) => {
    incrementallyPassInputs(userInput);

    function onError(err: any) {
      childProcess.stdin.end();
      result.error = err.data;
      reject(result);
    }

    childProcess.stdout.on('data', (data) => {
      result.stdout.push(data.toString());
    });
    childProcess.on('error', onError);
    childProcess.on('close', () => {
      result.success = true;

      resolve(result);
    });
  });

  function incrementallyPassInputs(inputs: string[]) {
    if (inputs.length === 0) {
      childProcess.stdin.end();

      return;
    }

    setTimeout(() => {
      childProcess.stdin.write(inputs[0]);

      incrementallyPassInputs(inputs.slice(1));
    }, INPUT_TIMEOUT);
  }
}

async function runInstall(directory: string) {
  return execPromise('yarn', {
    cwd: directory,
    env: {...process.env},
  });
}

// @ts-ignore
async function createBuild(directory: string) {
  const clientOptions: UserConfig = {
    root: directory,
    build: {
      outDir: `dist/client`,
      manifest: true,
    },
  };

  const serverOptions: UserConfig = {
    root: directory,
    build: {
      outDir: `dist/server`,
      ssr: 'src/entry-server.jsx',
    },
  };

  await Promise.all([build(clientOptions), build(serverOptions)]);
}

async function createServer(options?: ServerOptions): Promise<Server> {
  let server: ViteDevServer | null = null;

  return {
    start: async (directory) => {
      server = await createViteServer({
        root: directory,
        configFile: resolve(directory, 'vite.config.js'),
      });
      await server.listen();

      const base = server.config.base === '/' ? '' : server.config.base;
      const url = `http://localhost:${server.config.server.port}${base}`;

      return url;
    },
    async stop() {
      if (!server) {
        console.log('Attempted to stop the server, but it does not exist.');
        return;
      }

      await server.close();
    },
  };
}

// @ts-ignore
async function createStaticServer(directory: string): Promise<Server> {
  const serve = sirv(resolve(directory, 'dist'));
  const httpServer = createNodeServer(serve);
  const port = await getPort();
  return {
    start: () => {
      return new Promise((resolve, reject) => {
        httpServer.on('error', reject);

        httpServer.listen(port, () => {
          httpServer.removeListener('error', reject);
          resolve(`http://localhost:${port}`);
        });
      });
    },
    stop: async () => {
      httpServer.close();
    },
  };
}

class Sandbox {
  constructor(public readonly root: string) {}

  resolvePath(...parts: string[]) {
    return resolve(this.root, ...parts);
  }

  async write(file: string, contents: string) {
    const filePath = this.resolvePath(file);

    await mkdirp(dirname(filePath));
    await writeFile(filePath, contents, {encoding: 'utf8'});
  }

  async read(file: string) {
    const filePath = this.resolvePath(file);

    if (!(await pathExists(filePath))) {
      throw new Error(`Tried to read ${filePath}, but it could not be found.`);
    }

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
}

class Result {
  success = false;
  error: Error | null = null;
  stderr: string[] = [];
  stdout: string[] = [];

  get inspect() {
    return {
      success: this.success,
      error: this.error,
      stderr: this.stderr.join(''),
      stdout: this.stdout.join(''),
    };
  }
}

function inputFrom(input: Input, command: Command): string[] {
  const length = 10;
  const result: string[] = Array.from({length}, () => KeyInput.Enter);

  if (input == null) {
    return result;
  }

  Object.values(input).forEach((value, index) => {
    const keyStrokes = [];

    if (typeof value === 'string') {
      keyStrokes.push(value);
    }

    if (value === false) {
      keyStrokes.push(KeyInput.No);
    }

    if (value === true) {
      keyStrokes.push(KeyInput.Yes);
    }

    result[index] = [...keyStrokes, KeyInput.Enter].join('');
  });

  return result;
}
