import {useEffect} from 'react';
import {ClientAnalytics} from './index';

declare global {
  interface Window {
    Shopify: {
      Analytics: any;
    };
  }
}

export function Analytics({
  analyticDataFromServer,
}: {
  analyticDataFromServer: any;
}) {
  // Make AnalyticEventBus available in the client browser
  // useEffect(() => {
  //   (function () {
  //     window.Shopify = window.Shopify || {};
  //     window.Shopify.Analytics = window.Shopify.Analytics || ClientAnalytics;
  //   })();
  // }, [ClientAnalytics]);

  useEffect(() => {
    ClientAnalytics.pushToDatalayer(analyticDataFromServer);
    ClientAnalytics.publish('page-view', true);
  }, [analyticDataFromServer]);

  return null;
}
