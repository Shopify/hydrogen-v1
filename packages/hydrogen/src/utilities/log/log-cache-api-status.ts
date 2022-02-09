import {getRuntimeLogger} from '../../framework/runtime';
import {findQueryName} from './utils';

export function logCacheApiStatus(status: string | null, url: string) {
  const log = getRuntimeLogger();
  if (!log?.options?.showCacheApiStatus) {
    return;
  }

  log.debug(`[Cache] ${status?.padEnd(6)} query ${findQueryName(url)}`);
}
