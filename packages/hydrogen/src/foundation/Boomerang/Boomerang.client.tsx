import {useEffect} from 'react';
import {loadScript} from '../../utilities';
import {useShop} from '../useShop';

declare global {
  interface Window {
    BOOMR: any;
    BOOMR_onload: any;
  }
}

const URL =
  'https://cdn.shopify.com/shopifycloud/boomerang/shopify-boomerang-hydrogen.min.js';

export function Boomerang() {
  const {storeDomain} = useShop();

  useEffect(() => {
    (function () {
      if (
        window.BOOMR &&
        (window.BOOMR.version || window.BOOMR.snippetExecuted)
      ) {
        return;
      }

      // Executes only on first mount
      window.BOOMR = window.BOOMR || {};
      window.BOOMR.storeDomain = storeDomain;

      function boomerangSaveLoadTime(e: Event) {
        window.BOOMR_onload = (e && e.timeStamp) || Date.now();
      }

      // @ts-ignore
      function boomerangInit(e) {
        e.detail.BOOMR.init({
          producer_url: 'https://monorail-edge.shopifysvc.com/v1/produce',
        });
        e.detail.BOOMR.t_end = Date.now();
      }

      if (window.addEventListener) {
        window.addEventListener('load', boomerangSaveLoadTime, false);
        // @ts-ignore
      } else if (window.attachEvent) {
        // @ts-ignore
        window.attachEvent('onload', boomerangSaveLoadTime);
      }
      if (document.addEventListener) {
        document.addEventListener('onBoomerangLoaded', boomerangInit);
        // @ts-ignore
      } else if (document.attachEvent) {
        // @ts-ignore
        document.attachEvent('onpropertychange', function (e) {
          if (!e) e = event;
          if (e.propertyName === 'onBoomerangLoaded') boomerangInit(e);
        });
      }
    })();
    loadScript(URL).catch(() => {
      // ignore if boomerang doesn't load
      // most likely because of an ad blocker
    });
  }, [storeDomain]);

  return null;
}
