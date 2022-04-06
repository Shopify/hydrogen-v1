import {findQueryName} from './utils';
import {gray} from 'kolorist';
import {log} from '.';

export function logCacheApiStatus(status: string | null, url: string) {
  if (!log.options().showCacheApiStatus) {
    return;
  }

  log.debug(gray(`[Cache] ${status?.padEnd(8)} query ${findQueryName(url)}`));
}
