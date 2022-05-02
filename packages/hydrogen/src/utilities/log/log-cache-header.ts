import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
import {ServerComponentResponse} from '../../framework/Hydration/ServerComponentResponse';
import {QueryKey} from '../../types';
import {hashKey} from '../hash';
import {findQueryName, parseUrl} from './utils';
import {gray} from 'kolorist';
import {getLoggerWithContext} from './log';

import type {RenderType} from './log';

const color = gray;

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
  request: ServerComponentRequest,
  response?: ServerComponentResponse
) {
  const log = getLoggerWithContext(request);
  if (!log.options().showCacheControlHeader) {
    return;
  }

  log.debug(
    color(`┌── Cache control header for ${parseUrl(type, request.url)}`)
  );
  if (response) {
    log.debug(color(`│ ${response.cacheControlHeader}`));
  }

  const queryList = request.ctx.queryCacheControl;
  const longestQueryNameLength = queryList.reduce(
    (max: number, query: QueryCacheControlHeaders) =>
      Math.max(max, query.name.length),
    0
  );

  if (queryList.length > 0) {
    log.debug(color('│'));
    queryList.forEach((query: QueryCacheControlHeaders) => {
      log.debug(
        color(
          `│ query ${query.name.padEnd(longestQueryNameLength + 1)}${
            query.header
          }`
        )
      );
    });
  }

  log.debug(color('└──'));
}
