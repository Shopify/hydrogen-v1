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
  defineRSCOutlet,
} from '@shopify/hydrogen';

import {HeaderFallback} from '~/components';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import {DefaultSeo, NotFound} from '~/components/index.server';
import {Header} from './components/global/Header.server';
import {Footer} from './components/global/Footer.server';

export const HeaderRSCOutlet = defineRSCOutlet({
  outletName: 'HeaderRSCOutlet',
  component: Header,
});

export const FooterRSCOutlet = defineRSCOutlet({
  outletName: 'FooterRSCOutlet',
  component: Footer,
});

function App({request, outlet}: HydrogenRouteProps) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? (localeMatch[1] as CountryCode) : undefined;

  const isHome = pathname === `/${countryCode ? countryCode + '/' : ''}`;

  return outlet ? (
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
              <HeaderRSCOutlet />
              <main role="main" id="mainContent" className="flex-grow">
                <FileRoutes
                  basePath={countryCode ? `/${countryCode}/` : undefined}
                />
                <Route path="*" page={<NotFound />} />
              </main>
              <FooterRSCOutlet />
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

export default renderHydrogen(App, {
  HeaderRSCOutlet,
  FooterRSCOutlet,
});
