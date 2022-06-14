import {findQueryName} from './utils';
import {gray} from 'kolorist';
import {log} from '.';

export function logCacheApiStatus(status: string | null, url: string) {
  if (!log.options().showCacheApiStatus) {
    return;
  }

  let queryName: string | undefined;
  if (url.includes('shopify.dev')) {
    url = decodeURIComponent(url);
    queryName = findQueryName(url);
  }

  log.debug(
    gray(
      `[Cache] ${status?.padEnd(8)} ${queryName ? `query ${queryName}` : url}`
    )
  );
}
