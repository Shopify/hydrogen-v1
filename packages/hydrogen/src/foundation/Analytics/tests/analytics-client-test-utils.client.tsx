import React, {useEffect} from 'react';
import {mount} from '@shopify/react-testing';
import {Analytics} from '../Analytics.client.js';
import {ClientAnalytics} from '../ClientAnalytics.js';

export function SomeClientComponent({
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

export function mountComponent(analyticsData: any, children: React.ReactChild) {
  return mount(
    <>
      <Analytics analyticsDataFromServer={analyticsData} />
      {children}
    </>
  );
}
