import {resolve, basename, extname} from 'path';
import debug from 'debug';
import {InputError} from './utilities';

import {tree} from './utilities';
import {CONFIG_DIRECTORY} from './config';
import {Env} from './types';

interface ModuleType {
  default: (env: Env) => Promise<void>;
}

export class Command {
  private logger: debug.Debugger;
  private module: ModuleType | null = null;
  private modulePath: string | null = null;

  constructor(public command?: string) {
    this.logger = debug(`hydrogen/${command}`);
  }

  async run(env: Env) {
    if (!this.command) {
      throw new InputError();
    }

    this.logger(`Running ${this.command}`);

    if (!this.modulePath) {
      return;
    }

    this.module = await import(this.modulePath);

    if (!this.module) {
      return;
    }

    await this.module.default({
      ...env,
      logger: this.logger,
    });

    this.logger(`Finished ${this.command}`);
  }

  async load() {
    if (!this.command) {
      throw new InputError();
    }

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
