import {
  CorePlugin,
  MiniflareCore,
  MiniflareCoreOptions,
  BuildPlugin,
} from '@miniflare/core';
import {CachePlugin} from '@miniflare/cache';
import {VMScriptRunner} from '@miniflare/runner-vm';
import {Log, LogLevel, ScriptRunner} from '@miniflare/shared';
import vm from 'vm';

import {createServer, MiniOxygenServerOptions} from './server';
import {StorageFactory} from './storage';

const PLUGINS = {
  CorePlugin,
  CachePlugin,
  BuildPlugin,
};

export type MiniOxygenType = typeof PLUGINS;

export class MiniOxygen extends MiniflareCore<MiniOxygenType> {
  constructor(
    options: MiniflareCoreOptions<MiniOxygenType>,
    globals: Record<string, unknown>
  ) {
    const storageFactory = new StorageFactory();
    const runner = new VMScriptRunner();
    const scriptRunner = {
      run: (...args: Parameters<ScriptRunner['run']>) => {
        const globalScope = vm.createContext({
          ...args[0],
          ...globals,
        });

        return (runner.run as any)(globalScope, ...args.slice(1));
      },
    } as unknown as ScriptRunner;
    super(
      PLUGINS,
      {
        log: new Log(LogLevel.VERBOSE),
        storageFactory,
        scriptRunner,
      },
      {
        ...options,
      }
    );
  }

  async dispose() {
    return super.dispose();
  }

  createServer(options: MiniOxygenServerOptions) {
    return createServer(this, options);
  }
}
