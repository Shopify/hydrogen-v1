import debug from 'debug';
import {parseCliArguments, InputError, UnknownError} from './utilities';
import {Cli} from './ui';
import {Workspace} from './workspace';
import {Fs} from './fs';
import {loadConfig} from './config';
import {Env} from './types';

const logger = debug('hydrogen');

interface ModuleType {
  default: (env: Env) => Promise<void>;
}

(async () => {
  const rawInputs = process.argv.slice(2);
  const {command, root} = parseCliArguments(rawInputs);
  const ui = new Cli();

  const config = (await loadConfig('hydrogen', {root})) || {};
  const workspace = new Workspace({root, ...config});
  const fs = new Fs(root);

  if (!command) {
    ui.say(`Missing command input`, {error: true});

    throw new InputError();
  }

  async function runModule(module: ModuleType) {
    logger('Run start');

    await module.default({
      ui,
      fs,
      workspace,
      logger: debug(`hydrogen/${command}`),
    });

    logger('Run end');
  }

  try {
    const module = await import(`./commands/${command}`);

    await runModule(module);
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
