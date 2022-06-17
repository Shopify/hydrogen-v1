import {Suspense} from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  FileRoutes,
  type HydrogenRouteProps,
  PerformanceMetrics,
  PerformanceMetricsDebug,
  Route,
  Router,
  ShopifyAnalytics,
  ShopifyProvider,
} from '@shopify/hydrogen';

import {
  DefaultSeo,
  CartProviderWithSession,
  NotFound,
  HeaderFallback,
} from '~/components';

function App({routes, request}: HydrogenRouteProps) {
  const isHome = new URL(request.normalizedUrl).pathname === '/';

  return (
    <Suspense fallback={<HeaderFallback isHome={isHome} />}>
      <ShopifyProvider>
        <CartProviderWithSession>
          <Suspense>
            <DefaultSeo />
          </Suspense>
          <Router>
            <FileRoutes routes={routes} />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProviderWithSession>
        <PerformanceMetrics />
        {import.meta.env.DEV && <PerformanceMetricsDebug />}
        <ShopifyAnalytics />
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
