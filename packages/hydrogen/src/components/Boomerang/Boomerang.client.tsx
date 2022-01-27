import {useEffect} from 'react';
import {loadScript} from '../../utilities';

const URL =
  'https://cdn.shopify.com/shopifycloud/boomerang/shopify-boomerang-hydrogen.min.js';

export default function Boomerang({storeDomain}: {storeDomain: string}) {
  useEffect(() => {
    (function () {
      if (
        // @ts-ignore
        window.BOOMR &&
        // @ts-ignore
        (window.BOOMR.version || window.BOOMR.snippetExecuted)
      ) {
        return;
      }
      // @ts-ignore
      window.BOOMR = window.BOOMR || {};

      // @ts-ignore
      window.BOOMR.storeDomain = storeDomain;

      function boomerangSaveLoadTime(e: Event) {
        // @ts-ignore
        window.BOOMR_onload = (e && e.timeStamp) || new Date().getTime();
      }

      function boomerangInit(e: Event) {
        // @ts-ignore
        e.detail.BOOMR.init({
          producer_url: 'https://monorail-edge.shopifysvc.com/v1/produce',
        });
        // @ts-ignore
        e.detail.BOOMR.t_end = new Date().getTime();
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
    loadScript(URL);
  }, [storeDomain]);

  return null;
}
