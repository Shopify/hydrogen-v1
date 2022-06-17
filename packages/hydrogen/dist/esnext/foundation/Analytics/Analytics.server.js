import * as React from 'react';
import { useServerAnalytics } from './hook';
import { Analytics as AnalyticsClient } from './Analytics.client';
import { useServerRequest } from '../ServerRequestProvider';
import AnalyticsErrorBoundary from '../AnalyticsErrorBoundary.client';
import { wrapPromise } from '../../utilities';
const DELAY_KEY_1 = 'analytics-delay-1';
const DELAY_KEY_2 = 'analytics-delay-2';
export function Analytics() {
    const cache = useServerRequest().ctx.cache;
    // If render cache is empty, create a 50 ms delay so that React doesn't resolve this
    // component too early and potentially cause a mismatch in hydration
    if (cache.size === 0 && !cache.has(DELAY_KEY_1)) {
        analyticsDelay(cache, DELAY_KEY_1, 50);
    }
    // If this delay is created, execute it
    cache.has(DELAY_KEY_1) && cache.get(DELAY_KEY_1).read();
    // clean up this key so that it won't be saved to the preload cache
    cache.delete(DELAY_KEY_1);
    // Make sure all queries have returned before rendering the Analytics server component
    cache.forEach((cacheFn) => {
        if (cacheFn && typeof cacheFn === 'function') {
            const result = cacheFn.call();
            if (result instanceof Promise)
                throw result;
        }
    });
    // If all queries has returned (could be from cached queries),
    // delay Analytic component by another 1ms (put this component
    // to the end of the render queue) so that other scheduled
    // render work can be processed by React's concurrent render first
    if (cache.size > 1 && !cache.has(DELAY_KEY_2)) {
        analyticsDelay(cache, DELAY_KEY_2, 1);
    }
    cache.has(DELAY_KEY_2) && cache.get(DELAY_KEY_2).read();
    cache.delete(DELAY_KEY_2);
    return (React.createElement(AnalyticsErrorBoundary, null,
        React.createElement(AnalyticsClient, { analyticsDataFromServer: useServerAnalytics() })));
}
function analyticsDelay(cache, delayKey, delay) {
    const delayPromise = wrapPromise(new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, delay);
    }));
    cache.set(delayKey, delayPromise);
}
