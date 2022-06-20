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
  CartProvider,
} from '@shopify/hydrogen';

import {HeaderFallback} from '~/components';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import {DefaultSeo, NotFound} from '~/components/index.server';

function App({routes, request}: HydrogenRouteProps) {
  const pathname = new URL(request.normalizedUrl).pathname;
  // Another fairly simple regex where it would be helpful to give the gist:
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? localeMatch[1] : undefined;
  // We're handling localization with `/en/path` — are there other ways to handle this in Hydrogen? Do we consider this best practice?
  const isHome = pathname === `/${countryCode ? countryCode + '/' : ''}`;

  return (
    <Suspense fallback={<HeaderFallback isHome={isHome} />}>
      <ShopifyProvider>
        {/* Ergonomics itch: feels off to have to define countryCode props multiple times in several different contexts like this,
            especially when we have a component called "LocalizationProvider"... */}
        <LocalizationProvider countryCode={countryCode}>
          <CartProvider countryCode={countryCode as CountryCode}>
            <Suspense>
              <DefaultSeo />
            </Suspense>
            <Router>
              <FileRoutes
                basePath={countryCode ? `/${countryCode}/` : undefined}
                routes={routes}
              />
              {/* Not _that_ hard to figure out, but might not necessarily be obvious: */}
              {/* All non-defined paths fall back to 404 Not Found */}
              <Route path="*" page={<NotFound />} />
            </Router>
          </CartProvider>
          <PerformanceMetrics />
          {/* This is maybe overly terse to understand at a glance: */}
          {import.meta.env.DEV && <PerformanceMetricsDebug />}
          <ShopifyAnalytics />
        </LocalizationProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
