import { findQueryName } from './utils';
import { gray } from 'kolorist';
import { log } from '.';
export function logCacheApiStatus(status, url) {
    if (!log.options().showCacheApiStatus) {
        return;
    }
    let queryName;
    if (url.includes('shopify.dev')) {
        url = decodeURIComponent(url);
        queryName = findQueryName(url);
        if (url.includes('?lock')) {
            queryName += '-lock';
        }
    }
    log.debug(gray(`[Cache] ${status?.padEnd(8)} ${queryName ? `query ${queryName}` : url}`));
}
