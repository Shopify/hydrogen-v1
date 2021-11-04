import {cosmiconfig} from 'cosmiconfig';
import debug from 'debug';

const logger = debug('hydrogen');

export async function loadConfig() {
  logger('Loading config...');

  const configExplorer = cosmiconfig('hydrogen');
  const config = await configExplorer.search();

  if (!config) {
    logger('No config found');

    return null;
  }

  logger(`Config found at ${config.filepath}`);
  logger(config.config);

  return config.config;
}
