import {Suspense} from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Route,
  Router,
  FileRoutes,
  ShopifyProvider,
  CartProvider,
  ShopifyAnalytics,
  PerformanceMetrics,
  PerformanceMetricsDebug,
} from '@shopify/hydrogen';

import DefaultSeo from './components/DefaultSeo.server';
import {NotFound} from '~/components/pages';

function App({routes, request}) {
  const country = request.headers.get('oxygen-buyer-country');

  if (country) {
    fetch(`/api/countries`, {
      body: JSON.stringify({country, name}),
      method: 'POST',
    }).then(() => {
      window.location.reload();
    });
  }

  return (
    <Suspense fallback={null}>
      <ShopifyProvider>
        <CartProvider>
          <DefaultSeo />
          <Router>
            <FileRoutes routes={routes} />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
        <PerformanceMetrics />
        {import.meta.env.DEV && <PerformanceMetricsDebug />}
        <ShopifyAnalytics />
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
