import http from "http";
import https from "https";

import {
  CorePlugin,
  MiniflareCore,
  MiniflareCoreOptions,
  BuildPlugin,
} from '@miniflare/core';
import {createServer, HTTPPlugin} from '@miniflare/http-server';
import {CachePlugin} from '@miniflare/cache';
import {VMScriptRunner} from '@miniflare/runner-vm';
import {Log, LogLevel} from '@miniflare/shared';

// import {createServer} from './server';
import {StorageFactory} from './storage';

const PLUGINS = {
  CorePlugin,
  HTTPPlugin,
  BuildPlugin,
  CachePlugin,
};

type Plugins = typeof PLUGINS;

export type MiniOxygenOptions = MiniflareCoreOptions<Plugins> & {globals?: {[key: string | symbol]: any}};

export class MiniOxygen extends MiniflareCore<Plugins> {
  constructor(options: MiniOxygenOptions) {
    const storageFactory = new StorageFactory();

    // Extract globals for script runner
    delete options.globals;

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

  createServer(
    options?: http.ServerOptions & https.ServerOptions
  ): Promise<http.Server | https.Server> {
    return createServer(this, options);
  }
}
