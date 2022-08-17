import React from 'react';
import {
  mountComponent,
  SomeClientComponent,
} from './analytics-client-test-utils.client.js';
import {ClientAnalytics} from '../ClientAnalytics.js';

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
