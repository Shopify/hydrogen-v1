import {resolve, basename, extname} from 'path';

import debug from 'debug';

import {parseCliArguments, InputError, tree} from './utilities';
import {Cli} from './ui';
import {Workspace} from './workspace';
import {Fs} from './fs';
import {loadConfig, CONFIG_DIRECTORY} from './config';
import {Env} from './types';

const logger = debug('hydrogen');

interface ModuleType {
  default: (env: Env) => Promise<void>;
}

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

  if (inputs.command === 'init') {
    await workspace.commit();
  }
})().catch((error) => {
  logger(error);
  process.exitCode = 1;
});

class Command {
  private logger: debug.Debugger;
  private module: ModuleType | null = null;
  private modulePath: string | null = null;

  constructor(public command: string) {
    this.logger = debug(`hydrogen/${command}`);
  }

  async run(env: Env) {
    this.logger(`Running ${this.command}`);

    if (!this.modulePath) {
      return;
    }

    try {
      this.module = await import(this.modulePath);

      if (!this.module) {
        return;
      }

      await this.module.default({
        ...env,
        logger: this.logger,
      });
    } catch (error) {
      this.logger(error);
      env.ui.say(`Command module not found at ${this.modulePath}`, {
        error: true,
      });

      throw new InputError();
    }

    this.logger(`Finished ${this.command}`);
  }

  async load() {
    this.logger(`Loading ${this.command}`);

    const localCommands = await tree(resolve(CONFIG_DIRECTORY, 'commands'));

    this.modulePath =
      [...localCommands.files, ...localCommands.directories].find(
        matchCommand(this.command)
      ) || `./commands/${this.command}`;

    this.logger(`Loaded ${this.modulePath}`);
  }
}

function commandNameFromPath(path?: string) {
  return path ? basename(path, extname(path)) : '';
}

function matchCommand(inputCommand: string) {
  return (command: string) =>
    inputCommand.split('/').includes(commandNameFromPath(command));
}
