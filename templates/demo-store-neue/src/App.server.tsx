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
  LocalizationProvider,
} from '@shopify/hydrogen';

import {HeaderFallback} from '~/components';
import {
  CartProviderWithSession,
  DefaultSeo,
  NotFound,
} from '~/components/index.server';

function App({routes, request}: HydrogenRouteProps) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? localeMatch[1] : undefined;

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
                basePath={countryCode ? `/${countryCode}/` : undefined}
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
