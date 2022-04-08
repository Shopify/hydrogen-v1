import React, {useEffect} from 'react';
import {mount} from '@shopify/react-testing';
import {Analytics} from '../Analytics.client';
import {ClientAnalytics} from '../ClientAnalytics';

function SomeClientComponent({
  eventName,
  callback,
}: {
  eventName: string;
  callback: (payload: any) => void;
}) {
  useEffect(() => {
    ClientAnalytics.subscribe(eventName, callback);
  });
  return null;
}

function mountComponent(analyticsData: any, children: React.ReactChild) {
  return mount(
    <>
      <Analytics analyticsDataFromServer={analyticsData} />
      {children}
    </>
  );
}

describe('Analytics.client', () => {
  it('should receive page-view event on mount', async () => {
    const analyticsData = {
      test: '123',
    };

    await mountComponent(
      analyticsData,
      <>
        <SomeClientComponent
          eventName={ClientAnalytics.eventNames.PAGE_VIEW}
          callback={(payload) => {
            expect(payload).toEqual(analyticsData);
          }}
        />
      </>
    );
  });

  it('should process utm search parameters', async () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search:
          '?utm_id=123&utm_source=456&utm_campaign=789&utm_medium=012&utm_content=345&utm_term=678',
      },
    });
    const analyticsData = {
      test: '123',
    };

    await mountComponent(
      analyticsData,
      <>
        <SomeClientComponent
          eventName={ClientAnalytics.eventNames.PAGE_VIEW}
          callback={(payload) => {
            expect(payload).toEqual({
              ...analyticsData,
              utm: {
                id: '123',
                source: '456',
                campaign: '789',
                medium: '012',
                content: '345',
                term: '678',
              },
            });
          }}
        />
      </>
    );
  });

  it('should receive page-view and viewed-product event on mount', async () => {
    const analyticsData = {
      publishEventsOnNavigate: [ClientAnalytics.eventNames.VIEWED_PRODUCT],
      test: '123',
    };

    await mountComponent(
      analyticsData,
      <>
        <SomeClientComponent
          eventName={ClientAnalytics.eventNames.PAGE_VIEW}
          callback={(payload) => {
            expect(payload).toEqual(analyticsData);
          }}
        />
        <SomeClientComponent
          eventName={ClientAnalytics.eventNames.VIEWED_PRODUCT}
          callback={(payload) => {
            expect(payload).toEqual(analyticsData);
          }}
        />
      </>
    );
  });
});
