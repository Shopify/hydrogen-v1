import {useEffect} from 'react';
import {ClientAnalytics, loadScript} from '@shopify/hydrogen/client';

const URL = 'https://www.googletagmanager.com/gtag/js?id=G-39VXD1NQYB';
let isInit = false;

export function GoogleAnalytics() {
  useEffect(() => {
    if (!isInit) {
      isInit = true;

      loadScript(URL).catch(() => {});
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());

      gtag('config', 'G-39VXD1NQYB', {
        transport_url: `${document.location.origin}/__event`,
        send_page_view: false,
      });

      ClientAnalytics.subscribe('page-view', (payload) => {
        gtag('event', 'page_view');
      });
    }
  }, [isInit]);

  return null;
}
