import React, {Suspense} from 'react';
import {ServerComponentRequest} from '../../../framework/Hydration/ServerComponentRequest.server';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {ServerRequestProvider} from '../../ServerRequestProvider';
import {Analytics} from '../Analytics.server';
import {useServerAnalytics} from '../hook';

function SomeServerComponent({analyticsData}: {analyticsData: any}) {
  useServerAnalytics(analyticsData);
  return null;
}

function SomeApiDelayServerComponent({
  delay,
  request,
}: {
  delay: number;
  request: ServerComponentRequest;
}) {
  const cache = request.ctx.cache;
  const delayKey = `api-${delay}`;

  if (!cache.has(delayKey)) {
    let result: boolean;
    let promise: Promise<boolean>;

    cache.set(delayKey, () => {
      if (result !== undefined) return result;
      if (!promise) {
        promise = new Promise((resolve) => {
          setTimeout(() => {
            result = true;
            resolve(true);
          }, delay);
        });
      }

      throw promise;
    });
    /* eslint-disable react-hooks/rules-of-hooks */
    useServerAnalytics({
      [delayKey]: delay,
    });
    /* eslint-enable react-hooks/rules-of-hooks */
  }
  return <div>Api delay - {delay}</div>;
}

function mountComponent(
  request: ServerComponentRequest,
  children: React.ReactChild
) {
  return mountWithProviders(
    <ServerRequestProvider request={request}>
      <Suspense fallback={null}>
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </Suspense>
    </ServerRequestProvider>
  );
}

describe('Analytics.server', () => {
  it('should introduce delay if no cache queries are detected', async () => {
    const request = new ServerComponentRequest(
      new Request('https://examples.com')
    );
    const analyticsData = {
      test: '123',
    };
    await mountComponent(
      request,
      <>
        <Suspense fallback={null}>
          <SomeServerComponent analyticsData={analyticsData} />
        </Suspense>
      </>
    );

    const cache = request.ctx.cache;
    expect(cache.size).toEqual(1);
    expect(cache.has('analytics-delay')).toEqual(true);
    expect(request.ctx.analyticsData).toEqual({
      url: 'https://examples.com/',
      normalizedRscUrl: 'https://examples.com/',
      ...analyticsData,
    });
  });

  it('should wait for all cache queries', async () => {
    const request = new ServerComponentRequest(
      new Request('https://examples.com')
    );
    await mountComponent(
      request,
      <>
        <Suspense fallback={null}>
          <SomeApiDelayServerComponent request={request} delay={50} />
        </Suspense>
        <Suspense fallback={null}>
          <SomeApiDelayServerComponent request={request} delay={75} />
        </Suspense>
      </>
    );

    const cache = request.ctx.cache;
    expect(cache.size).toEqual(2);
    expect(cache.has('analytics-delay')).toEqual(false);
    expect(request.ctx.analyticsData).toEqual({
      url: 'https://examples.com/',
      normalizedRscUrl: 'https://examples.com/',
      'api-50': 50,
      'api-75': 75,
    });
  });
});
