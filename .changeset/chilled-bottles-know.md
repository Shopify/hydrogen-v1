---
'@shopify/hydrogen': minor
---

A new config file `hydrogen.config.js` replaces the existing `shopify.config.js` in your Hydrogen app.

## Introducing `hydrogen.config.js`

Hydrogen apps now expect a `hydrogen.config.js` in the root folder. This config file accepts Shopify storefront credentials, routes, session configuration, and more.

To migrate existing apps, you should create a `hydrogen.config.js` (or `hydrogen.config.ts`) file in your Hydrogen app:

```js
import {defineConfig} from '@shopify/hydrogen/config';
import {
  CookieSessionStorage,
  PerformanceMetricsServerAnalyticsConnector,
} from '@shopify/hydrogen';

export default defineConfig({
  routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
  shopify: {
    storeDomain: 'YOUR_STORE.myshopify.com',
    storefrontToken: 'YOUR_STOREFRONT_TOKEN',
    storefrontApiVersion: '2022-07',
  },
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
  serverAnalyticsConnectors: [PerformanceMetricsServerAnalyticsConnector],
});
```

Then, update your `App.server.jsx` to remove previous arguments from `renderHydrogen()`:

```diff
import renderHydrogen from '@shopify/hydrogen/entry-server';

-function App({routes}) {
+function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
-      <ShopifyProvider shopifyConfig={shopifyConfig}>
+      <ShopifyProvider>
        <CartProvider>
          <DefaultSeo />
          <Router>
-            <FileRoutes routes={routes} />
+            <FileRoutes />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
        <PerformanceMetrics />
        {process.env.LOCAL_DEV && <PerformanceMetricsDebug />}
      </ShopifyProvider>
    </Suspense>
  );
}

-const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');
-
-export default renderHydrogen(App, {
-  routes,
-  shopifyConfig,
-  session: CookieSessionStorage('__session', {
-    path: '/',
-    httpOnly: true,
-    secure: process.env.NODE_ENV === 'production',
-    sameSite: 'strict',
-    maxAge: 60 * 60 * 24 * 30,
-  }),
-  serverAnalyticsConnectors: [PerformanceMetricsServerAnalyticsConnector],
-});
+export default renderHydrogen(App);
```

Next, update `vite.config.js` in your app to remove references to `shopifyConfig`:

```diff
import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';
-import shopifyConfig from './shopify.config';

// https://vitejs.dev/config/
export default defineConfig({
-  plugins: [hydrogen(shopifyConfig)],
+  plugins: [hydrogen()],
```

Finally, delete `shopify.config.js` from your app.

[Read more about the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config)
