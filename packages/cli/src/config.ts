import {cosmiconfig, Options} from 'cosmiconfig';

import debug from 'debug';
import {resolve} from 'path';

const logger = debug('hydrogen');

export async function loadConfig(
  key = 'hydrogen',
  options: Options & {root?: string} = {}
) {
  const stopDir = options.root ? resolve(options.root) : process.cwd();

  logger(`Loading ${key} config at ${stopDir}...`);

  const configExplorer = cosmiconfig(key, {
    stopDir,
    cache: false,
    ...options,
  });

  try {
    const config = await configExplorer.search(stopDir);

    if (!config) {
      logger(`No ${key} config found`);

      return null;
    }

    logger(`Config ${key} found at ${config.filepath}`);
    logger(config.config);

    return config.config;
  } catch (error) {
    logger(error);
  }
}
