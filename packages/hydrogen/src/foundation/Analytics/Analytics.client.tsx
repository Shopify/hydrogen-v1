import {useEffect} from 'react';
import {ClientAnalytics} from './index';

export function Analytics({
  analyticsDataFromServer,
}: {
  analyticsDataFromServer: any;
}) {
  useEffect(() => {
    ClientAnalytics.hasSentPageView = false;
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('utm_source')) {
      ClientAnalytics.pushToPageAnalyticsData(
        {
          id: urlParams.get('utm_id'),
          source: urlParams.get('utm_source'),
          campaign: urlParams.get('utm_campaign'),
          medium: urlParams.get('utm_medium'),
          content: urlParams.get('utm_content'),
          term: urlParams.get('utm_term'),
        },
        'utm'
      );
    }

    ClientAnalytics.pushToPageAnalyticsData(analyticsDataFromServer);
    ClientAnalytics.subscribe(ClientAnalytics.eventNames.PAGE_VIEW, () => {
      ClientAnalytics.hasSentPageView = true;
    });
    ClientAnalytics.publish(ClientAnalytics.eventNames.PAGE_VIEW, true);
    if (analyticsDataFromServer.publishEventsOnNavigate) {
      analyticsDataFromServer.publishEventsOnNavigate.forEach(
        (eventName: string) => {
          ClientAnalytics.publish(eventName, true);
        }
      );
    }

    return function cleanup() {
      ClientAnalytics.resetPageAnalyticsData();
    };
  }, [analyticsDataFromServer]);

  return null;
}
