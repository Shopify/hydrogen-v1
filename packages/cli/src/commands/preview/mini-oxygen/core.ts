import {
  CorePlugin,
  CorePluginSignatures,
  MiniflareCore,
  MiniflareCoreOptions,
} from '@miniflare/core';
import {CachePlugin} from '@miniflare/cache';
import {VMScriptRunner} from '@miniflare/runner-vm';
import {Log, LogLevel} from '@miniflare/shared';

import {createServer} from './server';
import {StorageFactory} from './storage';

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

  createServer({assets = []}: {assets?: string[]} = {}) {
    return createServer(this, {assets});
  }
}

const PLUGINS = {
  CorePlugin,
  CachePlugin,
};
