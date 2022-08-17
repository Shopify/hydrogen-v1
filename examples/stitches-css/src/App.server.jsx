import React from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Router, FileRoutes, ShopifyProvider} from '@shopify/hydrogen';
import {Suspense} from 'react';
import StitchesStyleTag from './StitchesStyleTag.client';

function App() {
  return (
    <>
      <StitchesStyleTag />
      <Suspense fallback={null}>
        <ShopifyProvider>
          <Router>
            <FileRoutes />
          </Router>
        </ShopifyProvider>
      </Suspense>
    </>
  );
}

export default renderHydrogen(App);
