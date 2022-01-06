import type {Config} from './workspace/workspace';
import {loadConfig as loadUnconfig} from 'unconfig';
import debug from 'debug';
import {resolve} from 'path';

const logger = debug('hydrogen');

export async function loadConfig(key = 'hydrogen', root?: string) {
  const stopDir = root ? resolve(root) : process.cwd();

  logger(`Loading ${key} config at ${stopDir}...`);

  try {
    const {config, sources} = await loadUnconfig<Config>({
      sources: [
        {
          files: key,
          extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
        },
        {
          files: `${key}.config`,
          extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
        },
        {
          files: 'package.json',
          extensions: [],
          rewrite(_config: any) {
            return _config?.[key];
          },
        },
      ],
      cwd: stopDir,
      merge: false,
    });
    if (!config) {
      logger(`No ${key} config found`);

      return null;
    }

    logger(`Config ${key} found at ${sources[0]}`);
    logger(config);

    return config;
  } catch (error) {
    logger(error);
  }
}
