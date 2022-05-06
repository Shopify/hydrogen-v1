---
'@shopify/hydrogen': minor
---

## A new config file `hydrogen.config.js` replaces the existing `shopify.config.js` in your Hydrogen app

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

```jsx
import renderHydrogen from '@shopify/hydrogen/entry-server';

function App({routes}) {
  return '...';
}

export default renderHydrogen(App);
```

Finally, delete `shopify.config.js` from your app.

[Read more about the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config)
