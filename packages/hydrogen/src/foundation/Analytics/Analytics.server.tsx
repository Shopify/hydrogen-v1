import React from 'react';
import {useServerAnalytics} from './hook';
import {Analytics as AnalyticsClient} from './Analytics.client';
import {useServerRequest} from '../ServerRequestProvider';

const DELAY_KEY = 'analytics-delay';

export function Analytics() {
  const cache = useServerRequest().ctx.cache;

  // If render cache is empty, create a 50 ms delay so that React doesn't resolve this
  // component too early and potentially cause a mismatch in hydration
  if (cache.size === 0 && !cache.has(DELAY_KEY)) {
    let result: boolean;
    let promise: Promise<boolean>;

    cache.set(DELAY_KEY, () => {
      if (result !== undefined) {
        return result;
      }

      if (!promise) {
        promise = new Promise((resolve) => {
          setTimeout(() => {
            result = true;
            resolve(true);
          }, 50);
        });
      }

      throw promise;
    });
  }

  // Make sure all queries have returned before rendering the Analytics server component
  cache.forEach((cacheFn) => {
    if (cacheFn && typeof cacheFn === 'function') {
      const result = cacheFn.call();
      if (result instanceof Promise) throw result;
    }
  });

  const analyticsData = useServerAnalytics();
  return <AnalyticsClient analyticsDataFromServer={analyticsData} />;
}
