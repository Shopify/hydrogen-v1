import React from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Router,
  FileRoutes,
  ShopifyProvider,
  LocalizationProvider,
} from '@shopify/hydrogen';
import {Suspense} from 'react';

function App() {
  return (
    <Suspense fallback={null}>
      <ShopifyProvider>
        <LocalizationProvider>
          <Router>
            <FileRoutes />
          </Router>
        </LocalizationProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
