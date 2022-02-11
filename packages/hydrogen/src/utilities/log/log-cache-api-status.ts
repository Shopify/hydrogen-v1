import {findQueryName} from './utils';
import {gray} from 'kolorist';
import {getLogger} from '.';

export function logCacheApiStatus(status: string | null, url: string) {
  const log = getLogger();
  if (!log?.options?.showCacheApiStatus) {
    return;
  }

  log.debug(gray(`[Cache] ${status?.padEnd(6)} query ${findQueryName(url)}`));
}
