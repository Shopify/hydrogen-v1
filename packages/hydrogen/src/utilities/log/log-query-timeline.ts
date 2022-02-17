import {ServerComponentRequest} from '../../framework/Hydration/ServerComponentRequest.server';
// import {ServerComponentResponse} from '../../framework/Hydration/ServerComponentResponse.server';
import {QueryKey} from '../../types';
import {hashKey} from '../../framework/cache';
import {findQueryName, parseUrl} from './utils';
import {gray, red, yellow} from 'kolorist';
import {getLoggerWithContext} from './log';
import {getTime} from '..';

import type {RenderType} from './log';

export type TimingType = 'load' | 'render' | 'data' | 'preload';

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
  preload: 'Preload',
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
    const detectSuspenseWaterfall: {[key: string]: boolean} = {};
    let suspenseWaterfallDetectedCount = 0;

    queryList.forEach((query: QueryTiming, index: number) => {
      if (query.timingType === 'load' || query.timingType === 'preload') {
        detectSuspenseWaterfall[query.name] = true;
      } else if (query.timingType === 'render') {
        delete detectSuspenseWaterfall[query.name];
      }

      log.debug(
        color(
          `│ ${`${(query.timestamp - requestStartTime).toFixed(2)}ms`.padEnd(
            11
          )} ${TIMING_MAPPING[query.timingType].padEnd(7)} ${query.name}${
            query.timingType === 'data'
              ? ` (Took ${query.duration?.toFixed(2)}ms)`
              : ''
          }`
        )
      );

      // SSR + RSC render path generates 2 `load` and `render` for each query
      // We want to avoid falsely identifying a suspense waterfall near the end
      // of the query list
      //
      // The (index + 4) is detecting that near the end of list.
      // A complete set of events for a given query is 4 entries
      // │ (639.62ms)  Load   Localization
      // │ (993.33ms)  Fetch  Localization (Took 353.66ms)
      // │ (993.96ms)  Load   Localization      <-- second time React tries to load
      // │ (994.03ms)  Render Localization
      //
      // so the end of list index range is 3 (one less from a set entry) + 1 (zero index)
      if (
        queryList.length >= index + 4 &&
        Object.keys(detectSuspenseWaterfall).length === 0
      ) {
        suspenseWaterfallDetectedCount++;
        const warningColor =
          suspenseWaterfallDetectedCount === 1 ? yellow : red;
        log.debug(
          `${color(`│ `)}${warningColor(`Suspense waterfall detected`)}`
        );
      }
    });
  }

  log.debug(color('└──'));
}
