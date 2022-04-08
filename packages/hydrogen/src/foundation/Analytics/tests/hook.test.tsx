import React, {Suspense} from 'react';
import {ServerComponentRequest} from '../../../framework/Hydration/ServerComponentRequest.server';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {ServerRequestProvider} from '../../ServerRequestProvider';
import {useServerAnalytics} from '../hook';

function mountComponent(analyticsData?: any) {
  function Component() {
    const result = useServerAnalytics(analyticsData);
    return <div>{JSON.stringify(result)}</div>;
  }

  const request = new ServerComponentRequest(
    new Request('https://examples.com')
  );

  return mountWithProviders(
    <ServerRequestProvider request={request} isRSC={true}>
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </ServerRequestProvider>
  );
}

describe('useServerAnalytics', () => {
  it('should reads from request.ctx.analyticsData', async () => {
    const component = await mountComponent();
    expect(component).toContainReactComponent('div', {
      children: JSON.stringify({
        url: 'https://examples.com/',
        normailizedRscUrl: 'https://examples.com/',
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
        normailizedRscUrl: 'https://examples.com/',
        test: '123',
      }),
    });
  });
});
