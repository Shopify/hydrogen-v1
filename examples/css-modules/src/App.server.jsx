import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Router, FileRoutes, ShopifyProvider} from '@shopify/hydrogen';
import {Suspense} from 'react';
import hydrogenConfig from '../hydrogen.config';

function App() {
  return (
    <Suspense fallback="Loading...">
      <ShopifyProvider>
        <Router>
          <FileRoutes />
        </Router>
      </ShopifyProvider>
    </Suspense>
  );
}

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {
  routes,
  shopifyConfig: hydrogenConfig.shopify,
});
