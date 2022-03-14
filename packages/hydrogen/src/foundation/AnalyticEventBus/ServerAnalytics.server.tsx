import {useServerRequest} from '../ServerRequestProvider';

import {getNamedspacedEventname} from './utils';
import type {Subscriber, Subscribers, SubscriberFunction} from './types';

let subscribers: Subscribers = {};

export function pushToDatalayer(data: any): void {
  const request = useServerRequest();
  request.ctx.analyticData = Object.assign(
    {
      pageId: request.id,
    },
    request.ctx.analyticData,
    data
  );
}

export function getDatalayer(): any {
  const request = useServerRequest();
  return request.ctx.analyticData;
}

export function publish(eventname: string, payload?: any) {
  const namedspacedEventname = getNamedspacedEventname(eventname);
  const subs = subscribers[namedspacedEventname];

  if (subs) {
    Object.keys(subs).forEach((key) => {
      subs[key](Object.assign({}, payload));
    });
  }
}

export function subscribe(
  eventname: string,
  callbackFunction: SubscriberFunction
): Subscriber {
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
