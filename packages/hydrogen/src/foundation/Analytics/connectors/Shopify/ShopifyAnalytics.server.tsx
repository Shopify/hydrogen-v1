import React from 'react';
import AnalyticsErrorBoundary from '../../../AnalyticsErrorBoundary.client';
import {useServerRequest} from '../../../ServerRequestProvider';
import {SHOPIFY_S, SHOPIFY_Y} from './const';
import {ShopifyAnalyticsClient} from './ShopifyAnalytics.client';
import {buildUUID} from './utils';

export function ShopifyAnalytics() {
  const request = useServerRequest();
  const session = request.ctx.session;
  const cookies = session?.get();
  const cookieName = session?.name || 'no-session';

  session?.set({
    ...cookies,
    [SHOPIFY_Y]: (cookies && cookies[SHOPIFY_Y]) || buildUUID(),
    [SHOPIFY_S]: (cookies && cookies[SHOPIFY_S]) || buildUUID(),
    storefrontId: globalThis.Oxygen?.env?.SHOPIFY_STOREFRONT_ID || '0',
    acceptedLanguage:
      request.headers.get('Accept-Language')?.replace(/-.*/, '') || 'en',
  });

  return (
    <AnalyticsErrorBoundary>
      <ShopifyAnalyticsClient cookieName={cookieName} />
    </AnalyticsErrorBoundary>
  );
}
