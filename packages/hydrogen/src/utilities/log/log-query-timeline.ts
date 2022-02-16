import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
// import {ServerComponentResponse} from '../../framework/Hydration/ServerComponentResponse.server';
import {QueryKey} from '../../types';
import {hashKey} from '../../framework/cache';
import {findQueryName, parseUrl} from './utils';
import {gray, yellow} from 'kolorist';
import {getLoggerWithContext} from './log';
import {getTime} from '..';

import type {RenderType} from './log';

export type TimingType = 'load' | 'render' | 'data';

export type QueryTiming = {
  name: string;
  timingType: TimingType;
  timestamp: number;
  duration?: number;
};

const color = gray;
const TIMING_MAPPING = {
  load: 'Load',
  render: 'Render',
  data: 'Fetch',
};

export function collectQueryTimings(
  request: ServerComponentRequest,
  queryKey: QueryKey,
  timingType: TimingType,
  duration?: number
) {
  request.ctx.queryTimings.push({
    name: findQueryName(hashKey(queryKey)),
    timingType,
    timestamp: getTime(),
    duration,
  });
}

export function logQueryTimings(
  type: RenderType,
  request: ServerComponentRequest
) {
  const log = getLoggerWithContext(request);
  if (!log.options().showQueryTiming) {
    return;
  }

  log.debug(color(`┌── Query timings for ${parseUrl(type, request.url)}`));

  const queryList = request.ctx.queryTimings;
  if (queryList.length > 0) {
    const requestStartTime = request.time;
    let lastRenderTimestamp: number;
    queryList.forEach((query: QueryTiming) => {
      if (query.timingType === 'render') {
        lastRenderTimestamp = query.timestamp;
      }

      if (
        query.timingType === 'data' &&
        query.timestamp - lastRenderTimestamp > 50
      ) {
        log.debug(`${color(`│ `)}${yellow(`Suspense waterfall detected`)}`);
      }

      log.debug(
        color(
          `│ ${`(${(query.timestamp - requestStartTime).toFixed(2)}ms)`.padEnd(
            11
          )} ${TIMING_MAPPING[query.timingType].padEnd(6)} ${query.name}${
            query.timingType === 'data'
              ? ` (Took ${query.duration?.toFixed(2)}ms)`
              : ''
          }`
        )
      );
    });
  }

  log.debug(color('└──'));
}
