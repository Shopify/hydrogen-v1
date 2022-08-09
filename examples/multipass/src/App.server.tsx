import React from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  FileRoutes,
  type HydrogenRouteProps,
  Router,
  ShopifyProvider,
  CartProvider,
} from '@shopify/hydrogen';
import {Suspense} from 'react';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';

function App({request}: HydrogenRouteProps) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? (localeMatch[1] as CountryCode) : undefined;

  return (
    <Suspense fallback={null}>
      <ShopifyProvider countryCode={countryCode}>
        <CartProvider countryCode={countryCode}>
          <Router>
            <FileRoutes />
          </Router>
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
