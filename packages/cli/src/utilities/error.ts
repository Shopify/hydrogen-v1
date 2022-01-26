import {Loggable, Env} from '../types';

interface ErrorOptions {
  title?: string;
  content?: Loggable;
  suggestion?: Loggable;
}

const ID = Symbol.for('HydrogenCLI::HelpfulError');

export function isHelpfulError(value: unknown) {
  return Boolean((value as any)?.[ID]);
}

export class HelpfulError extends Error {
  readonly [ID] = true;
  readonly suggestion: ErrorOptions['suggestion'];
  readonly title: ErrorOptions['title'];
  readonly content: ErrorOptions['content'];

  constructor({title, content, suggestion}: ErrorOptions) {
    super(title);
    this.title = title;
    this.content = content;
    this.suggestion = suggestion;
  }
}

export class MissingDependencyError extends HelpfulError {
  constructor(dep: string) {
    super({
      title: `Missing the \`${dep}\` dependency`,
      content: () => `\`${dep}\` is required to use this command.`,
      suggestion: () =>
        [
          `- Run \`yarn\` to install all dependencies listed in the package.json.`,
          `- Run \`yarn add ${dep}\` to install the missing dependency.`,
        ].join(`\n`),
    });
  }
}

export function logError(error: any, env: Env) {
  env.ui.say(error.title ?? 'An unexpected error occurred', {
    error: true,
    breakAfter: true,
  });

  if (isHelpfulError(error)) {
    if (error.content) {
      env.ui.say('What happened?', {strong: true});
      env.ui.say(error.content(env), {breakAfter: true});
    }

    if (error.suggestion) {
      env.ui.say('What do I do next?', {strong: true});
      env.ui.say(error.suggestion(env), {breakAfter: true});
    }

    env.ui.say('Still experiencing issues?', {strong: true});
  }
  env.ui.say(
    'Help us make Hydrogen better by reporting this error so we can improve this message and/or fix the error.'
  );
  env.ui.say(
    '- Chat with us on Discord: https://discord.com/invite/ppSbThrFaS'
  );
  env.ui.say(
    '- Create an issue in GitHub: https://github.com/Shopify/hydrogen/issues/new'
  );

  env.ui.say('Error stack:', {strong: true});
  env.ui.say(error.stack);
}

// TODO: Make these more meaningful and add logging behavior
export class BaseError extends Error {}
export class NotImplementedError extends BaseError {}
export class InputError extends BaseError {}
export class UnknownError extends BaseError {}
export class RunError extends BaseError {}
