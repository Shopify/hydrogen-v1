type Subscriber = {unsubscribe: () => void};
type SubscriberFunction = (payload: any) => void;
type Subscribers = Record<string, Record<string, SubscriberFunction>>;

const RESERVED_EVENT_NAMES = ['page-view', 'viewed-product', 'add-to-cart'];

let subscribers: Subscribers = {};
let dataLayer: any = {};

function pushToDatalayer(data: any): void {
  dataLayer = Object.assign({}, dataLayer, data);
}

function getDatalayer(): any {
  return dataLayer;
}

function resetDatalayer(): void {
  dataLayer = {};
}

function publish(eventname: string, payload: any, resetDataLayer?: boolean) {
  const namedspacedEventname = getNamedspacedEventname(eventname);
  const subs = subscribers[namedspacedEventname];

  if (subs) {
    Object.keys(subs).forEach((key) => {
      console.log(`Publish analytic event to ${key}`);
      subs[key](Object.assign({}, dataLayer, payload));
    });
  }

  if (resetDataLayer || eventname === 'page-view') {
    resetDatalayer();
  }
}

function subscribe(
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

function getNamedspacedEventname(eventname: string): string {
  // Any event name that is not in the reserved space will be prefix with `c-`
  return RESERVED_EVENT_NAMES.indexOf(eventname) === -1
    ? `c-${eventname}`
    : eventname;
}

export default {
  pushToDatalayer,
  getDatalayer,
  resetDatalayer,
  publish,
  subscribe,
};
