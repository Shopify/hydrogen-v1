// Provide Hydrogen config loader to external tools like the CLI

import type {HydrogenPlugin} from '../shared-types';
import {VIRTUAL_PROXY_HYDROGEN_CONFIG_ID} from './plugins/vite-plugin-hydrogen-virtual-files.js';
import {viteception} from './viteception.js';
import path from 'path';
import {normalizePath} from 'vite';

export async function loadConfig(options = {root: process.cwd()}) {
  const {loaded} = await viteception(
    [VIRTUAL_PROXY_HYDROGEN_CONFIG_ID],
    options
  );

  return {configuration: loaded[0].default};
}

export function resolvePluginUrl(plugin: HydrogenPlugin, root = process.cwd()) {
  let importUrl = plugin.url ?? plugin.name;
  let absoluteUrl: string;

  if (importUrl.startsWith('file://')) {
    importUrl = importUrl.slice(7);
    importUrl = path.dirname(importUrl);
  }

  try {
    absoluteUrl = path.dirname(
      require.resolve(path.join(importUrl, 'package.json'))
    );
  } catch (error) {
    throw new Error(`Could not resolve Hydrogen Plugin "${plugin.name}"`, {
      cause: error as Error,
    });
  }

  importUrl = path.relative(root, normalizePath(absoluteUrl));
  if (!importUrl.startsWith('/')) {
    importUrl = '/' + importUrl;
  }

  return [importUrl, absoluteUrl];
}
