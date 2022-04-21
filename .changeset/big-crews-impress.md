---
'@shopify/hydrogen': minor
'create-hydrogen-app': minor
---

Hydrogen now has a built in session and cookie implementation. Read more about [how sessions work in Hydrogen](https://shopify.dev/custom-storefronts/hydrogen/framework/sessions). The starter template also includes a cookie session storage implementation. To use the new session implementation within an existing Hydrogen app:

```diff
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Router,
  Route,
  FileRoutes,
  ShopifyProvider,
+  CookieSessionStorage,
} from '@shopify/hydrogen';
import {Suspense} from 'react';
import shopifyConfig from '../shopify.config';
import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';
import LoadingFallback from './components/LoadingFallback';
import CartProvider from './components/CartProvider.client';

function App({routes}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
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

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {
  routes,
  shopifyConfig,
+  session: CookieSessionStorage('__session', {
+    path: '/',
+    httpOnly: true,
+    secure: process.env.NODE_ENV === 'production',
+    sameSite: 'strict',
+    maxAge: 60 * 60 * 24 * 30,
+  }),
});

```
