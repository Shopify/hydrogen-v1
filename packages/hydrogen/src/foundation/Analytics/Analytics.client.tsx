import {useEffect} from 'react';
import {ClientAnalytics} from './index';

export function Analytics({
  analyticsDataFromServer,
}: {
  analyticsDataFromServer: any;
}) {
  useEffect(() => {
    const urlParams = new URLSearchParams(document.location.search);

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
