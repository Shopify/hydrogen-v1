import {useEffect} from 'react';
import {loadScript} from '../../../../utilities/load_script.js';
import {ClientAnalytics} from '../../ClientAnalytics.js';
import {useShop} from '../../../useShop/index.js';

declare global {
  interface Window {
    BOOMR: any;
    BOOMR_onload: any;
  }
}

const URL =
  'https://cdn.shopify.com/shopifycloud/boomerang/shopify-boomerang-hydrogen.min.js';

export function PerformanceMetrics() {
  const {storeDomain} = useShop();

  useEffect(() => {
    try {
      (function () {
        if (
          window.BOOMR &&
          (window.BOOMR.version || window.BOOMR.snippetExecuted)
        ) {
          return;
        }

        // Executes only on first mount
        window.BOOMR = window.BOOMR || {};
        window.BOOMR.hydrogenPerformanceEvent = (data: any) => {
          const initTime = new Date().getTime();
          ClientAnalytics.publish(
            ClientAnalytics.eventNames.PERFORMANCE,
            true,
            data
          );
          const pageData = ClientAnalytics.getPageAnalyticsData();
          const shopId = pageData.shopify?.shopId;

          fetch('https://monorail-edge.shopifysvc.com/v1/produce', {
            method: 'post',
            headers: {
              'content-type': 'text/plain',
            },
            body: JSON.stringify({
              schema_id: 'hydrogen_buyer_performance/2.0',
              payload: {
                ...data,
                shop_id: shopId
                  ? shopId.substring(shopId.lastIndexOf('/') + 1)
                  : '',
              },
              metadata: {
                event_created_at_ms: initTime,
                event_sent_at_ms: new Date().getTime(),
              },
            }),
          });
        };
        window.BOOMR.storeDomain = storeDomain;

        function boomerangSaveLoadTime(e: Event) {
          window.BOOMR_onload = (e && e.timeStamp) || Date.now();
        }

        // @ts-ignore
        function boomerangInit(e) {
          e.detail.BOOMR.init();
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
    } catch (err) {
      // Do nothing
    }
  }, [storeDomain]);

  return null;
}
