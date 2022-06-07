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

      // Listen for events from Hydrogen
      // https://shopify.dev/custom-storefronts/hydrogen/framework/analytics#default-events
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.PAGE_VIEW,
        (payload) => {
          gtag('event', 'page_view');
        }
      );
    }
  });

  return null;
}
