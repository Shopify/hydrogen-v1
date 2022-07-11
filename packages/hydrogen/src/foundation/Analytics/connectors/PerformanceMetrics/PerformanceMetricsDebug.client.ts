import {useEffect} from 'react';
import {ClientAnalytics} from '../../ClientAnalytics.js';

const PAD = 10;
let isInit = false;
export function PerformanceMetricsDebug() {
  useEffect(() => {
    if (!isInit) {
      isInit = true;
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.PERFORMANCE,
        (data: any) => {
          console.group(`Performance - ${data.page_load_type} load`);
          logMetricIf('TTFB:', data.response_start - data.navigation_start);
          logMetricIf('FCP:', data.first_contentful_paint);
          logMetricIf('LCP:', data.largest_contentful_paint);
          logMetricIf('Duration:', data.response_end - data.navigation_start);
          console.groupEnd();
        }
      );
    }
  });

  return null;
}

function logMetricIf(lable: string, data: any | undefined) {
  data && console.log(`${lable.padEnd(PAD)}${Math.round(data)} ms`);
}
