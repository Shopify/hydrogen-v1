import debug from 'debug';

import {parseCliArguments, logError} from './utilities';
import {Cli} from './ui';
import {Workspace} from './workspace';
import {Fs} from './fs';
import {loadConfig} from './config';
import {Command} from './Command';

const logger = debug('hydrogen');

(async () => {
  const rawInputs = process.argv.slice(2);
  const {root, ...inputs} = parseCliArguments(rawInputs);
  const ui = new Cli();
  const config = (await loadConfig('hydrogen', {root})) || {};
  const workspace = new Workspace({root, ...config});
  const fs = new Fs(root);
  const command = new Command(inputs.command);
  const env = {ui, fs, workspace, logger};

  try {
    await command.load();
    await command.run(env);
  } catch (error) {
    logError(error, env);
  }
})().catch((error) => {
  logger(error);
  process.exitCode = 1;
});
