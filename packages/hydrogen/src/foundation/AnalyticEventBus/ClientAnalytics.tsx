import {getNamedspacedEventname} from './utils';
import type {Subscriber, Subscribers, SubscriberFunction} from './types';

type EventGuard = Record<string, number>;

let subscribers: Subscribers = {};
let pageAnalyticData: any = {};
const guardDupEvents: EventGuard = {};

function pushToPageAnalyticData(data: any, namespace?: string): void {
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
  return pageAnalyticData;
}

function resetPageAnalyticData(): void {
  pageAnalyticData = {};
}

function publish(eventname: string, guardDup = false, payload?: any) {
  const namedspacedEventname = getNamedspacedEventname(eventname);
  const subs = subscribers[namedspacedEventname];
  const combinedPayload = Object.assign({}, pageAnalyticData, payload);

  // De-dup events due to re-renders
  if (guardDup) {
    const eventGuard = guardDupEvents[namedspacedEventname];
    if (eventGuard && Date.now() - eventGuard < 10) {
      console.log('Client analytic de-dup');
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
  console.log('Client Subscribe');
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
