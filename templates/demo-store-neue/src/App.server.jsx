import {Suspense} from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Route,
  Router,
  FileRoutes,
  ShopifyProvider,
  ShopifyAnalytics,
  PerformanceMetrics,
  PerformanceMetricsDebug,
} from '@shopify/hydrogen';

import {DefaultSeo} from './components/blocks'; // TODO: find a better place for this
import {NotFound} from '~/components/pages';
import {CartProviderWithCountryCode} from './components/elements/CartProviderWithCountryCode';

function App({routes}) {
  return (
    <Suspense fallback={null}>
      <ShopifyProvider>
        <CartProviderWithCountryCode>
          <DefaultSeo />
          <Router>
            <FileRoutes routes={routes} />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProviderWithCountryCode>
        <PerformanceMetrics />
        {import.meta.env.DEV && <PerformanceMetricsDebug />}
        <ShopifyAnalytics />
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
