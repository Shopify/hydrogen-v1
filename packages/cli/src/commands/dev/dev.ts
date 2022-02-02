import childProcess from 'child_process';
import {join} from 'path';
import chalk from 'chalk';

import {
  checkHydrogenVersion,
  checkEslintConfig,
  checkNodeVersion,
} from '../check/rules';
import {Env} from '../../types';
import {MissingDependencyError} from '../../utilities/error';

export async function dev(env: Env) {
  const {ui, workspace, fs} = env;

  const binPath = join(workspace.root(), `/node_modules/.bin/vite`);

  if (!(await fs.exists(binPath))) {
    throw new MissingDependencyError('vite');
  }

  try {
    ui.say('Checking project for common errors...', {
      strong: true,
      breakAfter: true,
    });
    const checkResults = [
      ...(await checkNodeVersion(env)),
      ...(await checkHydrogenVersion(env)),
      ...(await checkEslintConfig(env)),
    ];

    const failedChecks = checkResults.filter(({success}) => !success);

    if (failedChecks.length) {
      ui.say(
        `${chalk.red.bold(`• ${failedChecks.length} errors `)}${chalk.dim(
          `found in ${checkResults.length} checks`
        )}`,
        {error: true}
      );
      ui.say('Run `yarn hydrogen check` for more information.', {
        breakAfter: true,
      });
    } else {
      ui.say(
        `${chalk.green.bold(`• No errors `)}${chalk.dim(
          `found in ${checkResults.length} checks`
        )}`
      );
    }

    checkResults.forEach((result) => {});
  } catch (error) {
    console.log(error);

    return;
  }

  ui.say('Starting Hydrogen server in dev...', {breakAfter: true});

  childProcess.spawn('node', [binPath, '--clearScreen', 'false'], {
    cwd: workspace.root(),
    stdio: 'inherit',
  });
}
