import {Env} from '../../types';

/**
 * Print the installed version of the `@shopify/hydrogen-cli`.
 */
export async function version({ui}: Pick<Env, 'ui'>) {
  const packageJson = require('../../../package.json');
  ui.say(`v${packageJson.version}`);
}
