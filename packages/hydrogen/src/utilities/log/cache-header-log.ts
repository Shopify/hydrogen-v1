import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {ServerComponentResponse} from '../../framework/Hydration/ServerComponentResponse.server';
import {QueryKey} from '../../types';
import {hashKey} from '../../framework/cache';
import {findQueryName, parseUrl} from './utils';

import type {Logger, RenderType} from './log';

export type QueryCacheControlHeaders = {
  name: string;
  header: string | null;
};

export function collectQueryCacheControlHeaders(
  request: ServerComponentRequest,
  queryKey: QueryKey,
  cacheControlHeader: string | null
) {
  request.ctx.queryCacheControl.push({
    name: findQueryName(hashKey(queryKey)),
    header: cacheControlHeader,
  });
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

  const queryList = request.ctx.queryCacheControl;
  const longestQueryNameLength = queryList.reduce(
    (max: number, query: QueryCacheControlHeaders) =>
      Math.max(max, query.name.length),
    0
  );

  if (queryList.length > 0) {
    log.debug('│');
    queryList.forEach((query: QueryCacheControlHeaders) => {
      log.debug(
        `│ query ${query.name.padEnd(longestQueryNameLength + 1)}${
          query.header
        }`
      );
    });
  }

  log.debug('└──');
}
