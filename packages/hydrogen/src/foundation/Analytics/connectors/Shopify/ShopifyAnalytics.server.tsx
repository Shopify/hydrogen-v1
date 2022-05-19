import React from 'react';
import {ServerComponentRequest} from '../../../../framework/Hydration/ServerComponentRequest.server';
import AnalyticsErrorBoundary from '../../../AnalyticsErrorBoundary.client';
import {ShopifyAnalyticsClient} from './ShopifyAnalytics.client';
import {buildUUID} from './utils';

const USER_COOKIE = '_shopify_y';
const SESSION_COOKIE = '_shopify_s';

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

  session?.set({
    ...cookies,
    [USER_COOKIE]: userCookie,
    [SESSION_COOKIE]: sessionCookie,
  });

  return (
    <AnalyticsErrorBoundary>
      <ShopifyAnalyticsClient cookieName={cookieName} />
    </AnalyticsErrorBoundary>
  );
}
