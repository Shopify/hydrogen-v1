import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Router, FileRoutes, ShopifyProvider} from '@shopify/hydrogen';
import {Suspense} from 'react';
import shopifyConfig from '../shopify.config';

function App({routes}) {
  return (
    <Suspense fallback="Loading...">
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <Router>
          <FileRoutes routes={routes} />
        </Router>
      </ShopifyProvider>
    </Suspense>
  );
}

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {shopifyConfig, routes});
