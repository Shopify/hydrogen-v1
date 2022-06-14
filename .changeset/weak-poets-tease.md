---
'@shopify/hydrogen': minor
---

**Breaking change:** The utilities used in `hydrogen.config.js` file are now exported from `@shopiy/hydrogen/config` instead of `@shopify/hydrogen`:

```diff
-import {defineConfig} from '@shopify/hydrogen/config';
import {
+ defineConfig,
  CookieSessionStorage,
  PerformanceMetricsServerAnalyticsConnector,
  ShopifyServerAnalyticsConnector,
-} from '@shopify/hydrogen';
+} from '@shopify/hydrogen/config'

export default defineConfig({
  shopify: {/* ... */},
  session: CookieSessionStorage('__session', {
    path: '/',
    /* ... */
  }),
  serverAnalyticsConnectors: [
    PerformanceMetricsServerAnalyticsConnector,
    ShopifyServerAnalyticsConnector,
  ],
});
```
