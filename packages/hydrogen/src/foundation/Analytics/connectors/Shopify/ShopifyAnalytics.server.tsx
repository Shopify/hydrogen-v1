import React from 'react';
import {ServerComponentRequest} from '../../../../framework/Hydration/ServerComponentRequest.server';
import AnalyticsErrorBoundary from '../../../AnalyticsErrorBoundary.client';
import {SHOPIFY_S, SHOPIFY_Y} from './const';
import {ShopifyAnalyticsClient} from './ShopifyAnalytics.client';
import {buildUUID} from './utils';

export function ShopifyAnalytics({
  request,
  cookieName,
}: {
  request: ServerComponentRequest;
  cookieName: string;
}) {
  const session = request.ctx.session;
  const cookies = session?.get();

  session?.set({
    ...cookies,
    [SHOPIFY_Y]: (cookies && cookies[SHOPIFY_Y]) || buildUUID(),
    [SHOPIFY_S]: (cookies && cookies[SHOPIFY_S]) || buildUUID(),
    storefrontId: Oxygen.env.SHOPIFY_STOREFRONT_ID || 0,
    acceptedLanguage:
      request.headers.get('Accept-Language')?.replace(/-.*/, '') || 'en',
  });

  return (
    <AnalyticsErrorBoundary>
      <ShopifyAnalyticsClient cookieName={cookieName} />
    </AnalyticsErrorBoundary>
  );
}
