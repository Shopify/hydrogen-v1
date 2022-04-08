import React, {useEffect} from 'react';
import {mount} from '@shopify/react-testing';
import {Analytics} from '../Analytics.client';
import {ClientAnalytics} from '../ClientAnalytics';

function SomeClientComponent({callback}: {callback: (payload: any) => void}) {
  useEffect(() => {
    ClientAnalytics.subscribe(ClientAnalytics.eventNames.PAGE_VIEW, callback);
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
  it('should receive page-view event', async () => {
    const analyticsData = {
      test: '123',
    };

    await mountComponent(
      analyticsData,
      <>
        <SomeClientComponent
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
});
