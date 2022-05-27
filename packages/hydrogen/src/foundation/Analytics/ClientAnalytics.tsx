import {getNamedspacedEventname, mergeDeep} from './utils';
import type {Subscriber, Subscribers, SubscriberFunction} from './types';
import {isServer} from '../../utilities';
import {eventNames} from './const';
import {EVENT_PATHNAME} from '../../constants';

type EventGuard = Record<string, NodeJS.Timeout>;

const subscribers: Subscribers = {};
let pageAnalyticsData: any = {};
const guardDupEvents: EventGuard = {};

const USAGE_ERROR =
  'ClientAnalytics should only be used within the useEffect callback or event handlers';

function isInvokedFromServer(): boolean {
  if (isServer()) {
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
  const subs = subscribers[namedspacedEventname];

  // De-dup events due to re-renders
  if (guardDup) {
    const eventGuardTimeout = guardDupEvents[namedspacedEventname];

    if (eventGuardTimeout) {
      clearTimeout(eventGuardTimeout);
    }

    const namespacedTimeout = setTimeout(() => {
      publishEvent(subs, mergeDeep(pageAnalyticsData, payload));
    }, 100);
    guardDupEvents[namedspacedEventname] = namespacedTimeout;
  } else {
    publishEvent(subs, mergeDeep(pageAnalyticsData, payload));
  }
}

function publishEvent(subs: Record<string, SubscriberFunction>, payload: any) {
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

export const ClientAnalytics = {
  pushToPageAnalyticsData,
  getPageAnalyticsData,
  resetPageAnalyticsData,
  publish,
  subscribe,
  pushToServer,
  eventNames,
  hasSentPageView: false,
};
