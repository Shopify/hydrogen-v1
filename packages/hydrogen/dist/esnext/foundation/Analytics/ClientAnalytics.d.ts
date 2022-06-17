import type { Subscriber, SubscriberFunction } from './types';
declare function pushToPageAnalyticsData(data: any): void;
declare function getPageAnalyticsData(): any;
declare function resetPageAnalyticsData(): void;
declare function publish(eventname: string, guardDup?: boolean, payload?: {}): void;
declare function subscribe(eventname: string, callbackFunction: SubscriberFunction): Subscriber;
declare function pushToServer(init?: RequestInit, searchParam?: string): Promise<Response>;
declare function hasSentFirstPageView(): Boolean;
export declare const ClientAnalytics: {
    pushToPageAnalyticsData: typeof pushToPageAnalyticsData;
    getPageAnalyticsData: typeof getPageAnalyticsData;
    resetPageAnalyticsData: typeof resetPageAnalyticsData;
    publish: typeof publish;
    subscribe: typeof subscribe;
    pushToServer: typeof pushToServer;
    eventNames: {
        PAGE_VIEW: string;
        VIEWED_PRODUCT: string;
        ADD_TO_CART: string;
        REMOVE_FROM_CART: string;
        UPDATE_CART: string;
        DISCOUNT_CODE_UPDATED: string;
        PERFORMANCE: string;
    };
    hasSentFirstPageView: typeof hasSentFirstPageView;
};
export {};
