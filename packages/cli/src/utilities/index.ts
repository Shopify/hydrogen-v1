import {resolve} from 'path';

import minimist from 'minimist';

export * from './error';
export * from './feature';
export {merge} from './merge';
export {componentName, validComponentName} from './react';
export {formatFile} from './format';

const DEFAULT_SUBCOMMANDS = {
  create: 'app',
  version: '',
};

export function parseCliArguments(rawInputs?: string[]) {
  const inputs = minimist(rawInputs || []);
  const command = inputs._[0];

  const root = inputs.root || process.cwd();
  const subcommand =
    inputs._[1] || DEFAULT_SUBCOMMANDS[command as 'create' | 'version'];
  const {debug} = inputs;

  return {
    root: resolve(root),
    mode: debug ? 'debug' : 'default',
    command: [command, subcommand].join('/'),
  };
}
