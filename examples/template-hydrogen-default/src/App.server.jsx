import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Router, Route, FileRoutes, ShopifyProvider} from '@shopify/hydrogen';
import {Suspense} from 'react';
import hydrogenConfig from '../hydrogen.config';
import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';
import LoadingFallback from './components/LoadingFallback';
import CartProvider from './components/CartProvider.client';

function App({routes}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider shopifyConfig={hydrogenConfig.shopify}>
        <CartProvider>
          <DefaultSeo />
          <Router>
            <FileRoutes routes={routes} />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App, {
  shopifyConfig: hydrogenConfig.shopify,
  routes: hydrogenConfig.routes,
});
