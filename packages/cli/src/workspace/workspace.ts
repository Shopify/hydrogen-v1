import {join} from 'path';
import {writeFile, readFile, pathExists} from 'fs-extra';
import {promisify} from 'util';
import childProcess from 'child_process';
import {merge} from '../utilities';
import {loadConfig} from '../config';

const exec = promisify(childProcess.exec);

const DEFAULT_PACKAGE_NAME = 'hydrogen-app';

interface DependencyOptions {
  dev?: boolean;
  version?: string;
}

interface Dependencies {
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
}

interface Config {
  typescript?: boolean;
  componentsDirectory: string;
}

const DEFAULT_CONFIG = {
  componentsDirectory: './src/components',
};

export class Workspace {
  dependencies = new Map<string, DependencyOptions>();
  config: Config;
  project: Promise<{[key: string]: any}>;
  _name?: string;
  _root: string;

  constructor({root, ...config}: Partial<Config> & {root: string}) {
    this._root = root;
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
    this.project = this.packageJson() || {};
  }

  async commit() {
    await this.gitInit();

    const additionalScripts: Record<string, string> = {};
    const additionalConfigs: Record<string, string> = {};

    const dependencies = Array.from(
      this.dependencies.entries()
    ).reduce<Dependencies>(
      (acc, [name, {dev, version}]) => {
        if (dev) {
          acc.devDependencies[name] = version || 'latest';
        } else {
          acc.dependencies[name] = version || 'latest';
        }
        return acc;
      },
      {dependencies: {}, devDependencies: {}}
    );

    const baseScripts = {
      dev: 'vite',
      build: 'yarn build:client && yarn build:server',
      'build:client': 'vite build --outDir dist/client --manifest',
      'build:server':
        'vite build --outDir dist/server --ssr src/entry-server.jsx',
    };

    const linters = [
      this.dependencies.has('eslint') &&
        'eslint --no-error-on-unmatched-pattern --ext .js,.ts,.jsx,.tsx src',
      this.dependencies.has('stylelint') &&
        'stylelint ./src/**/*.{css,sass,scss}',
    ].filter((script) => script);

    if (linters.length) {
      additionalScripts['lint'] = linters.join(' && ');
    }

    if (this.dependencies.has('@shopify/prettier-config')) {
      additionalConfigs['prettier'] = '@shopify/prettier-config';
    }

    const existingPackageJson = await this.project;

    const packageJson = JSON.stringify(
      merge(
        {
          name: this.name() || DEFAULT_PACKAGE_NAME,

          scripts: {
            ...baseScripts,
            ...additionalScripts,
          },
          ...dependencies,
          ...additionalConfigs,
        },
        existingPackageJson
      ),
      null,
      2
    );

    await writeFile(join(this.root(), 'package.json'), packageJson);
  }

  get packageManager() {
    return /yarn/.test(process.env.npm_execpath || '') ? 'yarn' : 'npm';
  }

  get isTypeScript() {
    return this.config.typescript || this.hasFile('tsconfig.json');
  }

  get componentsDirectory() {
    return this.config.componentsDirectory;
  }

  async packageJson() {
    return (await pathExists(join(this.root(), 'package.json')))
      ? JSON.parse(
          await readFile(join(this.root(), 'package.json'), {
            encoding: 'utf8',
          })
        )
      : {};
  }

  hasFile(path: string) {
    return pathExists(path);
  }

  name(name?: string) {
    if (name) {
      this._name = name;
      this._root = join(this._root, this._name);
    }

    return this._name || ``;
  }

  root() {
    return this._root;
  }

  install(dependency: string, options: DependencyOptions = {}) {
    if (this.dependencies.has(dependency)) {
      return;
    }

    this.dependencies.set(dependency, options);
  }

  async hasDependency(dependency: string): Promise<false | string> {
    const pkg = await this.project;

    if (pkg.dependencies && pkg.dependencies[dependency]) {
      return pkg.dependencies[dependency];
    }
    if (pkg.devDependencies && pkg.devDependencies[dependency]) {
      return pkg.devDependencies[dependency];
    }

    return false;
  }

  async nodeVersion() {
    const pkg = await this.project;

    if (pkg.engines && pkg.engines.node) {
      return pkg.engines.node;
    }

    return false;
  }

  getConfig(key: string) {
    return loadConfig(key, {root: this._root});
  }

  async gitInit() {
    try {
      await exec(`git init`, {cwd: this._root});
      // TODO: Change the branch name to main and commit files
      await writeFile(
        join(this._root, '.gitignore'),
        `
node_modules
.DS_Store
dist
dist-ssr
*.local
        `
      );
    } catch (error) {
      console.log(error);
    }
  }
}
