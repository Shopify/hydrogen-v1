import {Suspense} from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {Router, FileRoutes, ShopifyProvider} from '@shopify/hydrogen';
import {TranslationProvider} from './components/TranslationProvider.client';

function App() {
  return (
    <Suspense fallback={'Loading..'}>
      <ShopifyProvider>
        <Suspense fallback={'Loading lang..'}>
          <TranslationProvider>
            <Router>
              <FileRoutes />
            </Router>
          </TranslationProvider>
        </Suspense>
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
