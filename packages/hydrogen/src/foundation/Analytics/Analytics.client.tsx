import {useEffect} from 'react';
import {ClientAnalytics} from './index';

export function Analytics({
  analyticsDataFromServer,
}: {
  analyticsDataFromServer: any;
}) {
  useEffect(() => {
    const urlParams = Object.assign(
      {},
      ...document.location.search
        .substring(1)
        .split('&')
        .map((param) => {
          const [key, value] = param.split('=');
          return {[key]: value};
        })
    );

    if (urlParams.utm_source) {
      ClientAnalytics.pushToPageAnalyticsData(
        {
          id: urlParams.utm_id,
          source: urlParams.utm_source,
          campaign: urlParams.utm_campaign,
          medium: urlParams.utm_medium,
          content: urlParams.utm_content,
          term: urlParams.utm_term,
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
