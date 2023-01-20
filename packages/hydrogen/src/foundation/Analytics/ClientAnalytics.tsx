import {getNamedspacedEventname, mergeDeep} from './utils.js';
import type {Subscriber, Subscribers, SubscriberFunction} from './types.js';
import {eventNames} from './const.js';
import {EVENT_PATHNAME} from '../../constants.js';
import {META_ENV_SSR} from '../ssr-interop.js';

type EventGuard = Record<string, {timeout: NodeJS.Timeout; data: unknown}>;

const subscribers: Subscribers = {};
let pageAnalyticsData: any = {};
let isFirstPageViewSent: Boolean = false;
const guardDupEvents: EventGuard = {};

const USAGE_ERROR =
  'ClientAnalytics should only be used within the useEffect callback or event handlers';

function isInvokedFromServer(): boolean {
  if (META_ENV_SSR) {
    console.warn(USAGE_ERROR);
    return true;
  }
  return false;
}

function pushToPageAnalyticsData(data: any): void {
  if (isInvokedFromServer()) return;

  pageAnalyticsData = mergeDeep(pageAnalyticsData, data);
}

function getPageAnalyticsData(): any {
  if (isInvokedFromServer()) return;

  return pageAnalyticsData;
}

function resetPageAnalyticsData(): void {
  if (isInvokedFromServer()) return;

  pageAnalyticsData = {};
}

function publish(eventname: string, guardDup = false, payload = {}) {
  if (isInvokedFromServer()) return;

  const namedspacedEventname = getNamedspacedEventname(eventname);

  // De-dup events due to re-renders
  if (guardDup) {
    const guardName = namedspacedEventname + ':' + pageAnalyticsData.url;
    const eventGuardTimeout = guardDupEvents[guardName];

    if (eventGuardTimeout) {
      clearTimeout(eventGuardTimeout.timeout);
    }

    const namespacedTimeout = setTimeout(() => {
      publishEvent(namedspacedEventname, guardDupEvents[guardName].data);
      delete guardDupEvents[guardName];
    }, 2000);

    guardDupEvents[guardName] = {
      timeout: namespacedTimeout,
      data: mergeDeep(pageAnalyticsData, payload),
    };
  } else {
    publishEvent(namedspacedEventname, mergeDeep(pageAnalyticsData, payload));
  }
}

function publishEvent(eventname: string, payload: any) {
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

function subscribe(
  eventname: string,
  callbackFunction: SubscriberFunction
): Subscriber {
  if (isInvokedFromServer()) return {unsubscribe: () => {}};

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

function pushToServer(init?: RequestInit, searchParam?: string) {
  return fetch(
    `${EVENT_PATHNAME}${searchParam ? `?${searchParam}` : ''}`,
    Object.assign(
      {
        method: 'post',
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json',
        },
      },
      init
    )
  );
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
