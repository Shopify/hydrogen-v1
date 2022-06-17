import { getNamedspacedEventname, mergeDeep } from './utils';
import { eventNames } from './const';
import { EVENT_PATHNAME } from '../../constants';
import { META_ENV_SSR } from '../ssr-interop';
const subscribers = {};
let pageAnalyticsData = {};
let isFirstPageViewSent = false;
const guardDupEvents = {};
const USAGE_ERROR = 'ClientAnalytics should only be used within the useEffect callback or event handlers';
function isInvokedFromServer() {
    if (META_ENV_SSR) {
        console.warn(USAGE_ERROR);
        return true;
    }
    return false;
}
function pushToPageAnalyticsData(data) {
    if (isInvokedFromServer())
        return;
    pageAnalyticsData = mergeDeep(pageAnalyticsData, data);
}
function getPageAnalyticsData() {
    if (isInvokedFromServer())
        return;
    return pageAnalyticsData;
}
function resetPageAnalyticsData() {
    if (isInvokedFromServer())
        return;
    pageAnalyticsData = {};
}
function publish(eventname, guardDup = false, payload = {}) {
    if (isInvokedFromServer())
        return;
    const namedspacedEventname = getNamedspacedEventname(eventname);
    // De-dup events due to re-renders
    if (guardDup) {
        const eventGuardTimeout = guardDupEvents[namedspacedEventname];
        if (eventGuardTimeout) {
            clearTimeout(eventGuardTimeout);
        }
        const namespacedTimeout = setTimeout(() => {
            publishEvent(namedspacedEventname, mergeDeep(pageAnalyticsData, payload));
        }, 100);
        guardDupEvents[namedspacedEventname] = namespacedTimeout;
    }
    else {
        publishEvent(namedspacedEventname, mergeDeep(pageAnalyticsData, payload));
    }
}
function publishEvent(eventname, payload) {
    const subs = subscribers[eventname];
    if (!isFirstPageViewSent && eventname === eventNames.PAGE_VIEW) {
        isFirstPageViewSent = true;
    }
    if (subs) {
        Object.keys(subs).forEach((key) => {
            subs[key](payload);
        });
    }
}
function subscribe(eventname, callbackFunction) {
    if (isInvokedFromServer())
        return { unsubscribe: () => { } };
    const namedspacedEventname = getNamedspacedEventname(eventname);
    const subs = subscribers[namedspacedEventname];
    if (!subs) {
        subscribers[namedspacedEventname] = {};
    }
    const subscriberId = Date.now().toString();
    subscribers[namedspacedEventname][subscriberId] = callbackFunction;
    return {
        unsubscribe: () => {
            delete subscribers[namedspacedEventname][subscriberId];
        },
    };
}
function pushToServer(init, searchParam) {
    return fetch(`${EVENT_PATHNAME}${searchParam ? `?${searchParam}` : ''}`, Object.assign({
        method: 'post',
        headers: {
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
        },
    }, init));
}
function hasSentFirstPageView() {
    return isFirstPageViewSent;
}
export const ClientAnalytics = {
    pushToPageAnalyticsData,
    getPageAnalyticsData,
    resetPageAnalyticsData,
    publish,
    subscribe,
    pushToServer,
    eventNames,
    hasSentFirstPageView,
};
