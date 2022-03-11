import {ClientAnalytics} from '@shopify/hydrogen/client';

let init = false;
export default function AnalyticsListener() {
  if (!init) {
    ClientAnalytics.subscribe('page-view', (payload) => {
      console.log(payload);
    });
    init = true;
  }

  return null;
}
