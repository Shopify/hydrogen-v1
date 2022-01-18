import debug from 'debug';

import {parseCliArguments, InputError} from './utilities';
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

  if (!inputs.command) {
    ui.say(`Missing command input`, {error: true});

    throw new InputError();
  }

  const command = new Command(inputs.command);

  await command.load();
  await command.run({ui, fs, workspace, logger});

  for await (const file of fs.commit()) {
    ui.printFile(file);
  }

  await workspace.commit();
})().catch((error) => {
  logger(error);
  process.exitCode = 1;
});
