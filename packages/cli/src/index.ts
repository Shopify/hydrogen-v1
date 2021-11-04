import debug from 'debug';
import {parseCliArguments, InputError, UnknownError} from './utilities';
import {Cli} from './ui';
import {Workspace} from './workspace';
import {Fs} from './fs';
import {loadConfig} from './config';

const logger = debug('hydrogen');

(async () => {
  const rawInputs = process.argv.slice(2);
  const {command, root} = parseCliArguments(rawInputs);
  const ui = new Cli();

  const config = await loadConfig();
  const workspace = new Workspace({root, ...(config || {})});
  const fs = new Fs(root);

  if (!command) {
    ui.say(`Missing command input`, {error: true});

    throw new InputError();
  }

  try {
    const module = await import(`./commands/${command}`);

    await module.default({ui, fs, workspace});
  } catch (error) {
    logger(error);

    throw new UnknownError();
  }

  for await (const file of fs.commit()) {
    ui.printFile(file);
  }

  await workspace.commit();
})().catch((error) => {
  logger(error);
  process.exitCode = 1;
});
