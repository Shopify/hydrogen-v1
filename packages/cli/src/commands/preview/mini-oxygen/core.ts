import {CorePlugin, MiniflareCore} from '@miniflare/core';
import {VMScriptRunner} from '@miniflare/runner-vm';
import {Log, LogLevel} from '@miniflare/shared';

import {createServer} from './server';
import {StorageFactory} from './storage';

export class MiniOxygen extends MiniflareCore<any> {
  constructor(options: any) {
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
    await super.dispose();
  }

  createServer({assets = []}: {assets?: string[]} = {}) {
    return createServer(this, {assets});
  }
}

const PLUGINS = {
  CorePlugin,
};
