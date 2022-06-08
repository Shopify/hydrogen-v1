import {useEffect} from 'react';
import {ClientAnalytics, loadScript} from '@shopify/hydrogen';

const PIXEL_ID = 'XXXXXXXXXXXXXXXX'; // <-- Add your pixel ID here
let init = false;
export function MetaPixel() {
  useEffect(() => {
    console.log('useEffect!');
    if (!init) {
      init = true;

      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );
      fbq('init', PIXEL_ID);

      // Listen for events from Hydrogen
      // https://shopify.dev/custom-storefronts/hydrogen/framework/analytics#default-events
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.PAGE_VIEW,
        (payload) => {
          console.log('Page view!');
          fbq('track', 'PageView');
        }
      );

      if (ClientAnalytics.hasSentFirstPageView()) {
        console.log('Page view has sent');
      }
    }
  }, []);

  return null;
}
