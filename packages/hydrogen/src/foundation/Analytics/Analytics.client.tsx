import {useEffect} from 'react';
import {ClientAnalytics} from './ClientAnalytics.js';

export function Analytics({
  analyticsDataFromServer,
}: {
  analyticsDataFromServer: any;
}) {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    addUTMData(urlParams, 'id');
    addUTMData(urlParams, 'source');
    addUTMData(urlParams, 'campaign');
    addUTMData(urlParams, 'medium');
    addUTMData(urlParams, 'content');
    addUTMData(urlParams, 'term');

    ClientAnalytics.pushToPageAnalyticsData(analyticsDataFromServer);
    ClientAnalytics.publish(ClientAnalytics.eventNames.PAGE_VIEW, true);
    if (analyticsDataFromServer.publishEventsOnNavigate) {
      analyticsDataFromServer.publishEventsOnNavigate.forEach(
        (eventName: string) => {
          ClientAnalytics.publish(eventName, true);
        }
      );
    }
  }, [analyticsDataFromServer]);

  return null;
}

function addUTMData(urlParams: URLSearchParams, key: string) {
  if (urlParams.has(`utm_${key}`)) {
    ClientAnalytics.pushToPageAnalyticsData({
      utm: {
        [key]: urlParams.get(`utm_${key}`),
      },
    });
  }
}
