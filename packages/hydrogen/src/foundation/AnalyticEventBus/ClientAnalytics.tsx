import {getNamedspacedEventname} from './utils';
import type {Subscriber, Subscribers, SubscriberFunction} from './types';

type EventGuard = Record<string, number>;

let subscribers: Subscribers = {};
let dataLayer: any = {};
const guardDupEvents: EventGuard = {};

export function pushToDatalayer(data: any): void {
  dataLayer = Object.assign({}, dataLayer, data);
}

export function getDatalayer(): any {
  return dataLayer;
}

export function resetDatalayer(): void {
  dataLayer = {};
}

export function publish(eventname: string, guardDup = false, payload?: any) {
  const namedspacedEventname = getNamedspacedEventname(eventname);
  const subs = subscribers[namedspacedEventname];
  const combinedPayload = Object.assign({}, getDatalayer(), payload);

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

  // Publish to server
  try {
    fetch('/__event', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventname,
        payload: {
          ...combinedPayload,
          referrer: window.document.referrer,
        },
      }),
    });
  } catch (error) {}
}

export function subscribe(
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
