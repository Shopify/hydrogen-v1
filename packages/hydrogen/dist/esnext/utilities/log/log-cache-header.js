import { hashKey } from '../hash';
import { findQueryName, parseUrl } from './utils';
import { gray } from 'kolorist';
import { getLoggerWithContext } from './log';
const color = gray;
export function collectQueryCacheControlHeaders(request, queryKey, cacheControlHeader) {
    request.ctx.queryCacheControl.push({
        name: findQueryName(hashKey(queryKey)),
        header: cacheControlHeader,
    });
}
export function logCacheControlHeaders(type, request, response) {
    const log = getLoggerWithContext(request);
    if (!log.options().showCacheControlHeader) {
        return;
    }
    log.debug(color(`┌── Cache control header for ${parseUrl(type, request.url)}`));
    if (response) {
        log.debug(color(`│ ${response.cacheControlHeader}`));
    }
    const queryList = request.ctx.queryCacheControl;
    const longestQueryNameLength = queryList.reduce((max, query) => Math.max(max, query.name.length), 0);
    if (queryList.length > 0) {
        log.debug(color('│'));
        queryList.forEach((query) => {
            log.debug(color(`│ query ${query.name.padEnd(longestQueryNameLength + 1)}${query.header}`));
        });
    }
    log.debug(color('└──'));
}
