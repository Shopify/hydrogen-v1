import {useEffect} from 'react';
import {ClientAnalytics, loadScript} from '@shopify/hydrogen';

const PIXEL_ID = 'XXXXXXXXXXXXXXXX'; // <-- Add your pixel ID here
let init = false;

export function MetaPixel() {
  useEffect(() => {
    if (!init) {
      init = true;

      if (window.fbq) return;

      const fbq = (window.fbq = () => {
        fbq.callMethod
          ? fbq.callMethod.apply(fbq, arguments)
          : fbq.queue.push(arguments);
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

      // Listen for events from Hydrogen
      // https://shopify.dev/custom-storefronts/hydrogen/framework/analytics#default-events
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.PAGE_VIEW,
        (payload) => {
          fbq('track', 'PageView');
        }
      );
    }
  });

  return null;
}
