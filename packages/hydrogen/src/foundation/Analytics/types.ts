export type Subscriber = {unsubscribe: () => void};
export type SubscriberFunction = (payload: any) => void;
export type Subscribers = Record<string, Record<string, SubscriberFunction>>;
