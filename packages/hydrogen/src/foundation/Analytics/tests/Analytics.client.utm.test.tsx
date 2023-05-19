import React from 'react';
import {
  mountComponent,
  SomeClientComponent,
} from './analytics-client-test-utils.client.js';
import {ClientAnalytics} from '../ClientAnalytics.js';

// This test is in its own file is due to the fact that I cannot set
// window.location more than once
describe('Analytics.client utm', () => {
  it('should process utm search parameters', async (done) => {
    // global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search:
          '?utm_id=123&utm_source=456&utm_campaign=789&utm_medium=012&utm_content=345&utm_term=678',
      },
    });

    const analyticsData = {
      test: '123',
    };

    return mountComponent(
      analyticsData,
      <>
        <SomeClientComponent
          eventName={ClientAnalytics.eventNames.PAGE_VIEW}
          reset={true}
          callback={(payload: any) => {
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
            done();
          }}
        />
      </>
    );
  });
});
