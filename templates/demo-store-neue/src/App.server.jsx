import {Suspense} from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  FileRoutes,
  PerformanceMetrics,
  PerformanceMetricsDebug,
  Route,
  Router,
  ShopifyAnalytics,
  ShopifyProvider,
  LocalizationProvider,
} from '@shopify/hydrogen';

import {
  DefaultSeo,
  CartProviderWithSession,
  NotFound,
  HeaderFallback,
} from '~/components';

function App({routes, request}) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /\/([a-z]{2})\/.*/g.exec(pathname);
  const countryCode = localeMatch ? localeMatch[1] : null;

  const isHome = pathname === `/${countryCode ? countryCode + '/' : ''}`;

  return (
    <Suspense fallback={<HeaderFallback isHome={isHome} />}>
      <ShopifyProvider>
        <LocalizationProvider countryCode={countryCode}>
          <CartProviderWithSession>
            <Suspense>
              <DefaultSeo />
            </Suspense>
            <Router>
              <FileRoutes
                basePath={countryCode ? `/${countryCode}/` : null}
                routes={routes}
              />
              <Route path="*" page={<NotFound />} />
            </Router>
          </CartProviderWithSession>
          <PerformanceMetrics />
          {import.meta.env.DEV && <PerformanceMetricsDebug />}
          <ShopifyAnalytics />
        </LocalizationProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
