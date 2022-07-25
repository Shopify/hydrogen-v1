import {ClientAnalytics} from '../ClientAnalytics.js';
import type {Subscriber} from '../types.js';

describe('Analytics - ClientAnalytics', () => {
  const originalFetch = globalThis.fetch;
  const mockedFetch = jest.fn(originalFetch);
  const mockPageViewCallback = jest.fn();
  let pageViewSubscriber: Subscriber;

  beforeAll(() => {
    globalThis.fetch = mockedFetch;
  });

  it('should stores and reads from page analytics data', () => {
    const data = {
      test: '123',
    };
    ClientAnalytics.pushToPageAnalyticsData(data);

    expect(ClientAnalytics.getPageAnalyticsData()).toEqual(data);
  });

  it('should reset page analytics data from last test', () => {
    expect(ClientAnalytics.getPageAnalyticsData()).toEqual({
      test: '123',
    });
    ClientAnalytics.resetPageAnalyticsData();
    expect(ClientAnalytics.getPageAnalyticsData()).toEqual({});
  });

  it('should receive analytics event from subscriber', () => {
    const data = {
      test: '456',
    };
    pageViewSubscriber = ClientAnalytics.subscribe(
      ClientAnalytics.eventNames.PAGE_VIEW,
      mockPageViewCallback
    );
    ClientAnalytics.publish(ClientAnalytics.eventNames.PAGE_VIEW, false, data);
    expect(mockPageViewCallback).toHaveBeenCalledTimes(1);
    expect(mockPageViewCallback.mock.calls[0][0]).toEqual(data);
  });

  it('can unsubscribe from analytics event from last test', () => {
    ClientAnalytics.publish(ClientAnalytics.eventNames.PAGE_VIEW);

    expect(mockPageViewCallback).toHaveBeenCalledTimes(2);
    expect(mockPageViewCallback.mock.calls[0][0]).toEqual({
      test: '456',
    });

    pageViewSubscriber.unsubscribe();
    ClientAnalytics.publish(ClientAnalytics.eventNames.PAGE_VIEW);

    expect(mockPageViewCallback).toHaveBeenCalledTimes(2);
  });

  it('should de-duplicate analytics events when set', async () => {
    return new Promise<void>((resolve) => {
      mockPageViewCallback.mockClear();
      let calledTimes = 0;
      pageViewSubscriber = ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.PAGE_VIEW,
        (payload) => {
          calledTimes++;
          expect(calledTimes).toEqual(1);
          expect(payload).toEqual({
            test: '456',
          });
          resolve();
        }
      );
      ClientAnalytics.publish(ClientAnalytics.eventNames.PAGE_VIEW, true, {
        test: '123',
      });
      ClientAnalytics.publish(ClientAnalytics.eventNames.PAGE_VIEW, true, {
        test: '456',
      });
    });
  });

  it('should push analytics to server analytics endpoint', () => {
    mockedFetch.mockClear();
    mockedFetch.mockResolvedValue(new Response(null, {status: 200}));

    const requestInit = {
      method: 'post',
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: 123,
      }),
    };

    ClientAnalytics.pushToServer(requestInit);

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch.mock.calls[0][0]).toEqual('/__event');
    expect(mockedFetch.mock.calls[0][1]).toEqual(requestInit);
  });

  it('should push analytics to custom server analytics endpoint', () => {
    mockedFetch.mockClear();
    mockedFetch.mockResolvedValue(new Response(null, {status: 200}));

    const requestInit = {
      method: 'post',
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: 123,
      }),
    };

    ClientAnalytics.pushToServer(requestInit, 'Shopify');

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch.mock.calls[0][0]).toEqual('/__event?Shopify');
    expect(mockedFetch.mock.calls[0][1]).toEqual(requestInit);
  });

  it('should return eventname constants', () => {
    expect(ClientAnalytics.eventNames.PAGE_VIEW).toEqual('page-view');
    expect(ClientAnalytics.eventNames.VIEWED_PRODUCT).toEqual('viewed-product');
    expect(ClientAnalytics.eventNames.ADD_TO_CART).toEqual('add-to-cart');
    expect(ClientAnalytics.eventNames.REMOVE_FROM_CART).toEqual(
      'remove-from-cart'
    );
    expect(ClientAnalytics.eventNames.UPDATE_CART).toEqual('update-cart');
    expect(ClientAnalytics.eventNames.DISCOUNT_CODE_UPDATED).toEqual(
      'discount-code-updated'
    );
    expect(ClientAnalytics.eventNames.PERFORMANCE).toEqual('performance');
  });
});
