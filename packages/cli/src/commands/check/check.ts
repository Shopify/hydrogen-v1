import chalk from 'chalk';
import {Env, CheckResult} from '../../types';
import {
  checkHydrogenVersion,
  checkEslintConfig,
  checkNodeVersion,
} from './rules';

export async function check(env: Env) {
  const {ui} = env;

  ui.say('Running checks...');

  let results;

  try {
    results = [
      ...(await checkNodeVersion(env)),
      ...(await checkHydrogenVersion(env)),
      ...(await checkEslintConfig(env)),
    ];
  } catch (error) {
    console.log(error);

    return;
  }

  displayCheckResults(results, env);

  const failedChecks = results.filter(({success}) => !success);

  if (failedChecks.length) {
    ui.say(
      `${chalk.red.bold(`• ${failedChecks.length} errors `)}${chalk.dim(
        `found in ${results.length} checks`
      )}`
    );
  } else {
    ui.say(
      `${chalk.green.bold(`• No errors `)}${chalk.dim(
        `found in ${results.length} checks`
      )}`
    );
  }

  await fixChecks(results, env);
  console.log();
}

function displayCheckResults(allCheckResults: CheckResult[], env: Env) {
  const {ui} = env;
  const indent = '          ';
  const checksBySection = allCheckResults.reduce((acc, {type, ...rest}) => {
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push({type, ...rest});
    return acc;
  }, {} as {[key: string]: CheckResult[]});

  [...Object.entries(checksBySection)].forEach(([section, sectionResults]) => {
    const allChecksStatusEmoji = statusEmoji(
      sectionResults.every(({success}) => success)
    );

    console.log();
    ui.say(`${allChecksStatusEmoji} ${chalk.cyan.bold.underline(section)}`);
    console.log();

    sectionResults.forEach(({description, link, success, fix, id}) => {
      const docsLink = link ? chalk.dim(`${indent}${link}\n`) : '';
      const idText = id ? chalk.dim(id) : '';
      const fixedText = success ? '' : statusFixable(fix);
      const lines = [
        [statusEmoji(success), description, idText, fixedText].join(' '),
        docsLink,
      ];

      ui.say(lines.join('\n'));
    });
  });
  console.log();
}

async function fixChecks(results: CheckResult[], env: Env) {
  const {ui, fs} = env;
  let changedFiles = new Map();

  const allFixableResults: CheckResult[] = results.filter(
    ({fix, success}) =>
      !success && fix !== undefined && typeof fix === 'function'
  );

  if (allFixableResults.length === 0) {
    ui.say(`No fixable checks`);

    return;
  }

  console.log();
  console.log();
  await ui.say(
    `${allFixableResults.length} failed checks might be automatically fixable.`
  );
  console.log();
  const wantsFix = await ui.ask(
    `Do you want to apply automatic fixes to ${allFixableResults.length} failed checks?`,
    {boolean: true, name: 'fix', default: false}
  );

  if (!wantsFix) {
    return;
  }

  for await (const {description, files} of runFixers(
    allFixableResults as Required<CheckResult>[],
    env
  )) {
    ui.say([statusEmoji(true), description, chalk.green('fixed')].join(' '));

    changedFiles = new Map([...changedFiles, ...files]);
  }

  const cleanUpPromises = Array.from(changedFiles).map(
    async ([path, content]) => {
      const action = (await fs.exists(path))
        ? chalk.red(`{red overwrote`)
        : chalk.green(`{green wrote}`);

      await fs.write(path, content);

      ui.say(`${action}${stripPath(path)}`);
    }
  );

  await Promise.all(cleanUpPromises);
}

async function* runFixers(
  allFixableResults: Required<CheckResult>[],
  env: Env
) {
  for (const {fix, description} of allFixableResults) {
    try {
      await fix(env);
    } finally {
      yield {description, files: []};
    }
  }
}

function statusEmoji(success: boolean) {
  return success ? chalk.green(`✓`) : chalk.red(`✕`);
}

function statusFixable(fix: CheckResult['fix']) {
  return typeof fix === 'function' ? chalk.cyan(` (fixable) `) : ' ';
}

function stripPath(path: string) {
  return path.replace(`${process.cwd()}`, '');
}
