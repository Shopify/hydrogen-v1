import {CorePlugin, MiniflareCore} from '@miniflare/core';
import {VMScriptRunner} from '@miniflare/runner-vm';
import {Log, LogLevel} from '@miniflare/shared';

import {createServer} from './server.mjs';
import {StorageFactory} from './storage.mjs';

export class MiniOxygen extends MiniflareCore {
  constructor(options) {
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
      },
    );
  }

  async dispose() {
    await super.dispose();
  }

  createServer() {
    return createServer(this);
  }
}

const PLUGINS = {
  CorePlugin,
};
