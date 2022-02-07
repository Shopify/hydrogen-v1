import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {ServerComponentResponse} from '../../framework/Hydration/ServerComponentResponse.server';
import {QueryKey} from '../../types';
import {hashKey} from '../../framework/cache';
import {findQueryName, parseUrl} from './utils';

import type {Logger, RenderType} from './log';

type QueryCacheControlHeaders = {
  [key: string]: {
    name: string;
    header: string | null;
  };
};

let queryCacheControlHeaders: QueryCacheControlHeaders = {};
let longestQueryNameLength = 0;

export function collectQueryCacheControlHeaders(
  queryKey: QueryKey,
  cacheControlHeader: string | null
) {
  const cacheKey = hashKey(queryKey);
  const queryName = findQueryName(cacheKey);

  longestQueryNameLength =
    longestQueryNameLength < queryName.length
      ? queryName.length
      : longestQueryNameLength;
  queryCacheControlHeaders[cacheKey] = {
    name: queryName,
    header: cacheControlHeader,
  };
}

export function logCacheControlHeaders(
  type: RenderType,
  log: Logger,
  request: ServerComponentRequest,
  response?: ServerComponentResponse
) {
  if (!log.options?.showCacheControlHeader) {
    return;
  }

  log.debug(`┌── Cache control header for ${parseUrl(type, request.url)}`);
  if (response) {
    log.debug(`│ ${response.cacheControlHeader}`);
  }

  const queryList = Object.keys(queryCacheControlHeaders);
  if (queryList.length > 0) {
    log.debug('│');
    queryList.forEach((cacheKey) => {
      const query = queryCacheControlHeaders[cacheKey];
      log.debug(
        `│ query ${query.name.padEnd(longestQueryNameLength + 1)}${
          query.header
        }`
      );
    });
  }

  log.debug('└──');
  queryCacheControlHeaders = {};
}
