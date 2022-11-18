import {useEffect} from 'react';
import {ClientAnalytics, loadScript} from '@shopify/hydrogen';

const TRACKING_ID = 'UA-XXXXXXXXX-X'; // <-- Add your tracking ID here
const URL = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`;
let init = false;

export function GoogleAnalytics() {
  useEffect(() => {
    if (!init) {
      init = true;

      // gtag initialization code
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());

      // Configure your gtag
      gtag('config', TRACKING_ID, {
        send_page_view: false,
      });

      // Load the gtag script
      loadScript(URL).catch(() => {});

      function trackPageView(payload) {
        gtag('event', 'page_view');
      }

      // Listen for events from Hydrogen
      // https://shopify.dev/custom-storefronts/hydrogen/analytics#default-events
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.PAGE_VIEW,
        trackPageView
      );

      ClientAnalytics.hasSentFirstPageView() &&
        trackPageView(ClientAnalytics.getPageAnalyticsData());
    }
  });

  return null;
}
