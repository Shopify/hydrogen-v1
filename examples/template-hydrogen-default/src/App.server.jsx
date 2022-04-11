import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Router, Route, FileRoutes, ShopifyProvider} from '@shopify/hydrogen';
import {Suspense} from 'react';
import hydrogenConfig from '../hydrogen.config';
import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';
import LoadingFallback from './components/LoadingFallback';
import CartProvider from './components/CartProvider.client';

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider>
        <CartProvider>
          <DefaultSeo />
          <Router>
            <FileRoutes />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App, hydrogenConfig);
