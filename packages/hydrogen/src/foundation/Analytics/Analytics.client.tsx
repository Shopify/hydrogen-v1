import React, {useEffect} from 'react';
import {ShopifyAnalytics} from './connectors/Shopify/ShopifyAnalytics.client';
import {ClientAnalytics} from './index';

export function Analytics({
  analyticDataFromServer,
}: {
  analyticDataFromServer: any;
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
      ClientAnalytics.pushToPageAnalyticData(
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

    ClientAnalytics.pushToPageAnalyticData(analyticDataFromServer);
    ClientAnalytics.publish('page-view', true);
    if (analyticDataFromServer.publishEventsOnNavigate) {
      analyticDataFromServer.publishEventsOnNavigate.forEach(
        (eventName: string) => {
          ClientAnalytics.publish(eventName, true);
        }
      );
    }

    return function cleanup() {
      ClientAnalytics.resetPageAnalyticData();
    };
  }, [analyticDataFromServer]);

  return <ShopifyAnalytics />;
}
