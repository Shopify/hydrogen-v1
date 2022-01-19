import {resolve, basename, extname} from 'path';
import debug from 'debug';

import {InputError, tree} from './utilities';
import {CONFIG_DIRECTORY} from './config';
import {Env} from './types';

interface ModuleType {
  default: (env: Env) => Promise<void>;
}

export class Command {
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
      console.error(error);
      env.ui.say(`Command module not found at ${this.modulePath} ${error}`, {
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
