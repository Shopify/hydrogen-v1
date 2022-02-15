import inquirer from 'inquirer';
import chalk from 'chalk';
import {FileResult} from '../fs';

interface BaseOptions {
  validate?: (input: string) => boolean | string;
  default?: string | number | boolean;
  name?: string;
}

interface ChoiceQuestionOptions<T = {value: string}> extends BaseOptions {
  choices: T[];
}

interface BooleanQuestionOptions extends BaseOptions {
  boolean: true;
}

interface CheckboxQuestionOptions<T = {value: any}> extends BaseOptions {
  choices: T[];
  multiple: true;
}

type CombinedOptions<T> = Partial<BooleanQuestionOptions> &
  Partial<ChoiceQuestionOptions<T>> &
  Partial<CheckboxQuestionOptions<T>>;

interface ConstructorOptions {
  debug?: boolean;
}

interface SayOptions {
  error?: boolean;
  breakAfter?: boolean;
  strong?: boolean;
}

export interface Ui {
  ask<T>(message: string, options: CheckboxQuestionOptions<T>): Promise<T[]>;
  ask<T = string>(
    message: string,
    options: ChoiceQuestionOptions<T>
  ): Promise<T>;
  ask(message: string, options: BooleanQuestionOptions): Promise<boolean>;
  ask<T = string>(message: string, options?: BaseOptions): Promise<T>;
  say(message: string | [string, string][], options?: SayOptions): void;
  printFile(file: FileResult): void;
}

export class Cli implements Ui {
  debug: boolean;
  readonly indent = `  `;
  readonly prefix = chalk.bold.yellow.underline`h2`;

  constructor({debug}: ConstructorOptions | undefined = {}) {
    this.debug = debug || false;
  }

  async ask<T = string>(
    message: string,
    options: CheckboxQuestionOptions<T>
  ): Promise<T[]>;
  async ask<T = string>(
    message: string,
    options: ChoiceQuestionOptions<T>
  ): Promise<T>;
  async ask(message: string, options: BooleanQuestionOptions): Promise<boolean>;
  async ask<T = string>(message: string, options?: BaseOptions): Promise<T>;
  async ask<T>(message: string, options: CombinedOptions<T> = {}) {
    const name = options.name ?? 'question';
    const normalizedQuestion: any = {
      message,
      name,
      validate: options.validate,
      default: options.default,
    };

    if (options?.choices) {
      normalizedQuestion.choices = options.choices;
      normalizedQuestion.type = options.multiple ? 'checkbox' : 'list';
    }

    if (options?.boolean) {
      normalizedQuestion.type = 'confirm';
    }

    const result = await inquirer.prompt<{
      [key: string]: any;
    }>(normalizedQuestion);

    return result[name];
  }

  say(message: string | [string, string?][], options: SayOptions = {}) {
    if (Array.isArray(message)) {
      message.forEach((msg) => {
        const [label, ...values] = msg;
        const spacer = [this.indent, this.indent].join('');

        console.log(chalk.cyan([spacer, label, ...values].join(spacer)));
      });
      return;
    }

    const styledText = options.error ? chalk.redBright`${message}` : message;
    const type = options.error
      ? `${chalk.black.bgRedBright` error `}${this.indent}`
      : '';
    const combinedMessage = [type, styledText].join('');

    console.log(options.strong ? chalk.bold(combinedMessage) : combinedMessage);

    if (options.breakAfter) {
      console.log('');
    }
  }

  printFile({path, overwritten, diff}: FileResult) {
    const overwrote = overwritten
      ? chalk.redBright`• Overwrote`
      : chalk.greenBright`• Wrote new`;

    const difference =
      !overwritten || diff === undefined || false
        ? ``
        : chalk.cyanBright`• No change`;

    this.say(
      [overwrote, difference, chalk.underline.whiteBright(path)].join(' ')
    );
  }
}
