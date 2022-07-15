import React, {Suspense} from 'react';
import {HydrogenRequest} from '../../HydrogenRequest/HydrogenRequest.server.js';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';
import {ServerRequestProvider} from '../../ServerRequestProvider/index.js';
import {useServerAnalytics} from '../hook.js';

function mountComponent(analyticsData?: any) {
  function Component() {
    const result = useServerAnalytics(analyticsData);
    return <div>{JSON.stringify(result)}</div>;
  }

  const request = new HydrogenRequest(new Request('https://examples.com'));

  return mountWithProviders(
    <ServerRequestProvider request={request}>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </ServerRequestProvider>
  );
}

describe('Analytics - useServerAnalytics', () => {
  it('should reads from request.ctx.analyticsData', async () => {
    const component = await mountComponent();
    expect(component).toContainReactComponent('div', {
      children: JSON.stringify({
        url: 'https://examples.com/',
        normalizedRscUrl: 'https://examples.com/',
      }),
    });
  });

  it('should stores and reads from request.ctx.analyticsData', async () => {
    const component = await mountComponent({
      test: '123',
    });
    expect(component).toContainReactComponent('div', {
      children: JSON.stringify({
        url: 'https://examples.com/',
        normalizedRscUrl: 'https://examples.com/',
        test: '123',
      }),
    });
  });
});
