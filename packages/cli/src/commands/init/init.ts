import {join, relative} from 'path';
import {readdirSync, copy} from 'fs-extra';
import {yellow, underline} from 'chalk';
import {Env} from '../../types';
import app from '../create/app';

export enum Template {
  None = 'None',
  Default = 'Default Hydrogen starter',
}

/**
 * Create a new `@shopify/hydrogen` app.
 */
export async function init(env: Env) {
  const {ui, fs, workspace, hooks, ...passThroughEnv} = env;

  const name = await ui.ask('What do you want to name this app?', {
    validate: validateProjectName,
    default: 'snow-devil',
    name: 'name',
  });

  workspace.name(name);

  if (await fs.exists(workspace.root())) {
    const overwrite = await ui.ask(
      `${workspace.root()} is not an empty directory. Do you want to remove the existing files and continue?`,
      {boolean: true, name: 'overwrite', default: false}
    );

    if (overwrite) {
      await fs.empty(workspace.root());
    }
  } else {
    await fs.makeDir(workspace.root());
  }

  const template = await ui.ask<Template>(
    'Would you like to start from a template?',
    {
      choices: [Template.Default, Template.None],
      name: 'template',
    }
  );

  if (template === Template.None) {
    const context = {name, ...passThroughEnv.context};
    await app({...passThroughEnv, hooks, ui, fs, workspace, context});
  }

  if (template === Template.Default) {
    const templateDir = join(__dirname, 'templates', 'template-hydrogen');
    const files = readdirSync(templateDir);

    for await (const file of files) {
      const srcPath = fs.join(templateDir, file);
      const destPath = fs.join(workspace.root(), file);
      await copy(srcPath, destPath);
    }

    if (process.env.LOCAL) {
      workspace.install('@shopify/hydrogen', {
        version: 'file:../../Shopify/hydrogen/packages/hydrogen',
      });
    }
  }

  console.log();

  hooks.onUpdateFile = async (filePath) => {
    await ui.printFile(filePath);
  };
  hooks.onCommit = finish;
}

async function finish({ui, workspace}: Pick<Env, 'ui' | 'workspace'>) {
  console.log();
  ui.say(
    `${underline('Success!')} Created app in ${yellow(
      `/${relative(process.cwd(), workspace.root())}`
    )}.`
  );
  ui.say(`Run the following commands to get started:`);
  console.log();
  if (workspace.root() !== process.cwd()) {
    ui.say([
      [
        ` • cd ${relative(process.cwd(), workspace.root())}`,
        'change into the project directory',
      ],
    ]);
  }
  const usesYarn = workspace.packageManager === 'yarn' || process.env.LOCAL;
  ui.say([
    [
      ` • ${usesYarn ? `yarn` : `npm install --legacy-peer-deps`}`,
      '         install the dependencies',
    ],
    [` • ${usesYarn ? `yarn` : `npm run`} dev`, '     start the dev server'],
  ]);
  console.log();
  console.log();
  console.log();
}

function validateProjectName(name: string) {
  const packageNameRegExp =
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

  if (packageNameRegExp.test(name)) {
    return true;
  }

  const suggested = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-');

  return `Invalid package.json name. Try ${suggested} instead.`;
}
