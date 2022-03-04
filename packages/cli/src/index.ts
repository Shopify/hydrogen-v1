import debug from 'debug';
import {parseCliArguments, logError} from './utilities';
import {Env} from './types';
import {Cli} from './ui';
import {Workspace} from './workspace';
import {Fs} from './fs';
import {loadConfig} from './config';
import {Command} from './Command';

const logger = debug('hydrogen');

export async function init(commandConfig?: any /* TODO do better than any */) {
  const rawInputs = process.argv.slice(2);
  const {root, ...inputs} = parseCliArguments(rawInputs);
  const ui = new Cli();
  const config = (await loadConfig('hydrogen', {root})) || {};
  const workspace = new Workspace({root, ...config});
  const fs = new Fs(root);
  const hooks: Env['hooks'] = {
    onUpdateFile: () => Promise.resolve(),
    onCommit: () => Promise.resolve(),
  };
  inputs.command = commandConfig ? commandConfig.command : inputs.command;

  const command = new Command(inputs.command);
  const env = {ui, fs, workspace, logger, hooks};

  try {
    await command.load();
    await command.run(env);

    // this is a temporary implementation to support a post-commit hook
    // and a more robust implementation will be added in the future
    // that will take inspiration from the tapable library
    // see: https://github.com/webpack/tapable
    for await (const file of fs.commit()) {
      await hooks.onUpdateFile(file);
    }

    await hooks.onCommit({hooks, ui, workspace, fs, logger});
  } catch (error) {
    logError(error, env);
  }
}
