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
  CartProvider,
} from '@shopify/hydrogen';

import {HeaderFallback} from '~/components';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import {DefaultSeo, NotFound} from '~/components/index.server';

import {Header} from './sections/Header.server';
import {Footer} from './sections/Footer.server';

function App({request, section}: HydrogenRouteProps) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? (localeMatch[1] as CountryCode) : undefined;

  const isHome = pathname === `/${countryCode ? countryCode + '/' : ''}`;

  return section ? (
    <ShopifyProvider countryCode={countryCode}>
      <FileRoutes basePath={countryCode ? `/${countryCode}/` : undefined} />
    </ShopifyProvider>
  ) : (
    <Suspense fallback={<HeaderFallback isHome={isHome} />}>
      <ShopifyProvider countryCode={countryCode}>
        <CartProvider countryCode={countryCode}>
          <Suspense>
            <DefaultSeo />
          </Suspense>
          <Router>
            <div className="flex flex-col min-h-screen">
              <div className="">
                <a href="#mainContent" className="sr-only">
                  Skip to content
                </a>
              </div>
              <Header />
              <main role="main" id="mainContent" className="flex-grow">
                <FileRoutes
                  basePath={countryCode ? `/${countryCode}/` : undefined}
                />
                <Route path="*" page={<NotFound />} />
              </main>
              <Footer />
            </div>
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
