import React from 'react';
import AnalyticsErrorBoundary from '../../../AnalyticsErrorBoundary.client';
import {useServerRequest} from '../../../ServerRequestProvider';
import {ShopifyAnalyticsClient} from './ShopifyAnalytics.client';

export function ShopifyAnalytics() {
  const request = useServerRequest();

  return (
    <AnalyticsErrorBoundary>
      <ShopifyAnalyticsClient
        serverData={{
          storefrontId: globalThis.Oxygen?.env?.SHOPIFY_STOREFRONT_ID || '0',
          acceptedLanguage:
            request.headers.get('Accept-Language')?.replace(/-.*/, '') || 'en',
        }}
      />
    </AnalyticsErrorBoundary>
  );
}
