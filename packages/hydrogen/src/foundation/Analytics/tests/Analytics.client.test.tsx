import React, {useEffect} from 'react';
import {mount} from '@shopify/react-testing';
import {Analytics} from '../Analytics.client';
import {ClientAnalytics} from '../ClientAnalytics';

function SomeClientComponent({
  eventName,
  reset,
  callback,
}: {
  eventName: string;
  reset?: Boolean;
  callback: (payload: any) => void;
}) {
  useEffect(() => {
    const subscriber = ClientAnalytics.subscribe(eventName, (payload: any) => {
      callback(payload);
      subscriber.unsubscribe();

      if (reset) {
        ClientAnalytics.resetPageAnalyticsData();
      }
    });

    // Fake publish analytics event because test is creating different
    // ClientAnalytics instances between <Analytics> and <SomeClientComponet>
    ClientAnalytics.publish(eventName);
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
  afterEach(async () => {
    // a reseting mount for ClientAnalytics instance
    await mountComponent(
      {},
      <>
        <SomeClientComponent
          eventName={ClientAnalytics.eventNames.PAGE_VIEW}
          reset={true}
          callback={() => {}}
        />
      </>
    );
  });

  it('should receive page-view event on mount', async (done) => {
    const analyticsData = {
      test: '123',
    };

    await mountComponent(
      analyticsData,
      <>
        <SomeClientComponent
          eventName={ClientAnalytics.eventNames.PAGE_VIEW}
          reset={true}
          callback={(payload: any) => {
            expect(payload).toEqual(analyticsData);
            done();
          }}
        />
      </>
    );
  });

  it('should receive page-view and viewed-product event on mount', async (done) => {
    const analyticsData = {
      publishEventsOnNavigate: [ClientAnalytics.eventNames.VIEWED_PRODUCT],
      test: '123',
    };

    let doneCount = 0;
    const allDone = () => {
      doneCount++;
      if (doneCount === 2) {
        done();
      }
    };

    await mountComponent(
      analyticsData,
      <>
        <SomeClientComponent
          eventName={ClientAnalytics.eventNames.PAGE_VIEW}
          callback={(payload) => {
            expect(payload).toEqual(analyticsData);
            allDone();
          }}
        />
        <SomeClientComponent
          eventName={ClientAnalytics.eventNames.VIEWED_PRODUCT}
          callback={(payload) => {
            expect(payload).toEqual(analyticsData);
            allDone();
          }}
        />
      </>
    );
  });
});
