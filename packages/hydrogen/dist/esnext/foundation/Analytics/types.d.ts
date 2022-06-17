export declare type Subscriber = {
    unsubscribe: () => void;
};
export declare type SubscriberFunction = (payload: any) => void;
export declare type Subscribers = Record<string, Record<string, SubscriberFunction>>;
