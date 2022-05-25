import React from 'react';
import {ServerComponentRequest} from '../../../../framework/Hydration/ServerComponentRequest.server';
import AnalyticsErrorBoundary from '../../../AnalyticsErrorBoundary.client';
import {SESSION_COOKIE, USER_COOKIE} from './const';
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
  const userCookie = (cookies && cookies[USER_COOKIE]) || buildUUID();
  const sessionCookie = (cookies && cookies[SESSION_COOKIE]) || buildUUID();
  const storefrontId = Oxygen.env.SHOPIFY_STOREFRONT_ID || 0;

  session?.set({
    ...cookies,
    [USER_COOKIE]: userCookie,
    [SESSION_COOKIE]: sessionCookie,
    storefrontId,
    acceptedLanguage:
      request.headers.get('Accept-Language')?.replace(/-.*/, '') || 'en',
  });

  return (
    <AnalyticsErrorBoundary>
      <ShopifyAnalyticsClient cookieName={cookieName} />
    </AnalyticsErrorBoundary>
  );
}
