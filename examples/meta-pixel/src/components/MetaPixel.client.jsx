import {useEffect} from 'react';
import {ClientAnalytics, loadScript} from '@shopify/hydrogen';

const PIXEL_ID = 'XXXXXXXXXXXXXXXX'; // <-- Add your pixel ID here
let init = false;

export function MetaPixel() {
  useEffect(() => {
    if (!init) {
      init = true;

      if (window.fbq) return;

      const fbq = (window.fbq = (...args) => {
        fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args);
      });

      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = !0;
      fbq.version = '2.0';
      fbq.queue = [];

      loadScript('https://connect.facebook.net/en_US/fbevents.js').catch(
        () => {}
      );

      fbq('init', PIXEL_ID);

      function trackPageView(payload) {
        fbq('track', 'PageView');
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
