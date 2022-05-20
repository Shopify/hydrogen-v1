import * as React from 'react';
import {useServerAnalytics} from './hook';
import {Analytics as AnalyticsClient} from './Analytics.client';
import {useServerRequest} from '../ServerRequestProvider';
import AnalyticsErrorBoundary from '../AnalyticsErrorBoundary.client';

const DELAY_KEY_1 = 'analytics-delay-1';
const DELAY_KEY_2 = 'analytics-delay-2';

export function Analytics() {
  const cache = useServerRequest().ctx.cache;

  // If render cache is empty, create a 50 ms delay so that React doesn't resolve this
  // component too early and potentially cause a mismatch in hydration
  if (cache.size === 0 && !cache.has(DELAY_KEY_1)) {
    analyticDelay(cache, DELAY_KEY_1, 50);
  }
  cache.has(DELAY_KEY_1) && cache.get(DELAY_KEY_1).call();
  cache.delete(DELAY_KEY_1);

  // Make sure all queries have returned before rendering the Analytics server component
  cache.forEach((cacheFn: any) => {
    if (cacheFn && typeof cacheFn === 'function') {
      const result = cacheFn.call();
      if (result instanceof Promise) throw result;
    }
  });

  // If all queries has returned (could be from cached queries),
  // delay Analytic component by another 1ms (put this component
  // to the end of the scheduled queue) so that other scheduled
  // work can be processed by react first
  if (cache.size > 1 && !cache.has(DELAY_KEY_2)) {
    analyticDelay(cache, DELAY_KEY_2, 1);
  }
  cache.has(DELAY_KEY_2) && cache.get(DELAY_KEY_2).call();
  cache.delete(DELAY_KEY_2);

  return (
    <AnalyticsErrorBoundary>
      <AnalyticsClient analyticsDataFromServer={useServerAnalytics()} />
    </AnalyticsErrorBoundary>
  );
}

function analyticDelay(
  cache: Map<string, any>,
  delayKey: string,
  delay: number
) {
  let result: boolean;
  let promise: Promise<boolean>;

  cache.set(delayKey, () => {
    if (result !== undefined) {
      return result;
    }

    if (!promise) {
      promise = new Promise((resolve) => {
        setTimeout(() => {
          result = true;
          resolve(true);
        }, delay);
      });
    }

    throw promise;
  });
}
