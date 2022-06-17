import { useEffect } from 'react';
import { loadScript } from '../../../../utilities/load_script';
import { ClientAnalytics } from '../../ClientAnalytics';
import { useShop } from '../../../useShop';
const URL = 'https://cdn.shopify.com/shopifycloud/boomerang/shopify-boomerang-hydrogen.min.js';
export function PerformanceMetrics() {
    const { storeDomain } = useShop();
    useEffect(() => {
        try {
            (function () {
                if (window.BOOMR &&
                    (window.BOOMR.version || window.BOOMR.snippetExecuted)) {
                    return;
                }
                // Executes only on first mount
                window.BOOMR = window.BOOMR || {};
                window.BOOMR.hydrogenPerformanceEvent = (data) => {
                    ClientAnalytics.publish(ClientAnalytics.eventNames.PERFORMANCE, true, data);
                    ClientAnalytics.pushToServer({
                        body: JSON.stringify(data),
                    }, ClientAnalytics.eventNames.PERFORMANCE);
                };
                window.BOOMR.storeDomain = storeDomain;
                function boomerangSaveLoadTime(e) {
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
                }
                else if (window.attachEvent) {
                    // @ts-ignore
                    window.attachEvent('onload', boomerangSaveLoadTime);
                }
                if (document.addEventListener) {
                    document.addEventListener('onBoomerangLoaded', boomerangInit);
                    // @ts-ignore
                }
                else if (document.attachEvent) {
                    // @ts-ignore
                    document.attachEvent('onpropertychange', function (e) {
                        if (!e)
                            e = event;
                        if (e.propertyName === 'onBoomerangLoaded')
                            boomerangInit(e);
                    });
                }
            })();
            loadScript(URL).catch(() => {
                // ignore if boomerang doesn't load
                // most likely because of an ad blocker
            });
        }
        catch (err) {
            // Do nothing
        }
    }, [storeDomain]);
    return null;
}
