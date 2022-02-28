import {
  CorePlugin,
  CorePluginSignatures,
  MiniflareCore,
  MiniflareCoreOptions,
  BuildPlugin,
} from '@miniflare/core';
import {CachePlugin} from '@miniflare/cache';
import {VMScriptRunner} from '@miniflare/runner-vm';
import {Log, LogLevel} from '@miniflare/shared';

import {createServer, MiniOxygenServerOptions} from './server';
import {StorageFactory} from './storage';

const PLUGINS = {
  CorePlugin,
  CachePlugin,
  BuildPlugin,
};

export class MiniOxygen extends MiniflareCore<CorePluginSignatures> {
  constructor(options: MiniflareCoreOptions<CorePluginSignatures>) {
    const storageFactory = new StorageFactory();
    super(
      PLUGINS,
      {
        log: new Log(LogLevel.VERBOSE),
        storageFactory,
        scriptRunner: new VMScriptRunner(),
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
