import {getNamedspacedEventname} from './utils';
import type {Subscriber, Subscribers, SubscriberFunction} from './types';
import {isServer} from '../../utilities';

type EventGuard = Record<string, number>;

let subscribers: Subscribers = {};
let pageAnalyticData: any = {};
const guardDupEvents: EventGuard = {};

const USAGE_ERROR =
  'ClientAnalytic should only be used within the useEffect callback or event handlers';

function isInvokedFromServer(): boolean {
  if (isServer()) {
    console.warn(USAGE_ERROR);
    return true;
  }
  return false;
}

function pushToPageAnalyticData(data: any, namespace?: string): void {
  if (isInvokedFromServer()) return;

  if (namespace) {
    pageAnalyticData[namespace] = Object.assign(
      {},
      pageAnalyticData[namespace] || {},
      data
    );
  } else {
    pageAnalyticData = Object.assign({}, pageAnalyticData, data);
  }
}

function getPageAnalyticData(): any {
  if (isInvokedFromServer()) return;

  return pageAnalyticData;
}

function resetPageAnalyticData(): void {
  if (isInvokedFromServer()) return;

  pageAnalyticData = {};
}

function publish(eventname: string, guardDup = false, payload?: any) {
  if (isInvokedFromServer()) return;

  const namedspacedEventname = getNamedspacedEventname(eventname);
  const subs = subscribers[namedspacedEventname];
  const combinedPayload = Object.assign({}, pageAnalyticData, payload);

  // De-dup events due to re-renders
  if (guardDup) {
    const eventGuard = guardDupEvents[namedspacedEventname];
    if (eventGuard && Date.now() - eventGuard < 10) {
      guardDupEvents[namedspacedEventname] = Date.now();
      return;
    } else {
      guardDupEvents[namedspacedEventname] = Date.now();
    }
  }

  if (subs) {
    Object.keys(subs).forEach((key) => {
      subs[key](combinedPayload);
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

export const ClientAnalytics = {
  pushToPageAnalyticData,
  getPageAnalyticData,
  resetPageAnalyticData,
  publish,
  subscribe,
};
