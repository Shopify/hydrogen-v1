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
  useSession,
} from '@shopify/hydrogen';
import {HeaderFallback, EventsListener} from '~/components';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import {DefaultSeo, NotFound} from '~/components/index.server';
import {CART_FRAGMENT} from './lib/fragments';

function App({request}: HydrogenRouteProps) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? (localeMatch[1] as CountryCode) : undefined;

  const isHome = pathname === `/${countryCode ? countryCode + '/' : ''}`;

  const {customerAccessToken} = useSession();

  return (
    <Suspense fallback={<HeaderFallback isHome={isHome} />}>
      <EventsListener />
      <ShopifyProvider countryCode={countryCode}>
        <CartProvider
          countryCode={countryCode}
          cartFragment={CART_FRAGMENT}
          customerAccessToken={customerAccessToken}
        >
          <Suspense>
            <DefaultSeo />
          </Suspense>
          <Router>
            <FileRoutes
              basePath={countryCode ? `/${countryCode}/` : undefined}
            />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
        <PerformanceMetrics />
        {import.meta.env.DEV && <PerformanceMetricsDebug />}
        <ShopifyAnalytics cookieDomain="hydrogen.shop" />
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
