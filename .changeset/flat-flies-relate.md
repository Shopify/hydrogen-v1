---
'@shopify/hydrogen': patch
---

You can now easily disable streaming on any page conditionally with the `enableStreaming` option inside `hydrogen.config.js`:

```ts
import {CookieSessionStorage} from '@shopify/hydrogen';
import {defineConfig} from '@shopify/hydrogen/config';

export default defineConfig({
  routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
  shopify: {
    defaultLocale: 'en-us',
    storeDomain: 'hydrogen-preview.myshopify.com',
    storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
    storefrontApiVersion: '2022-07',
  },
  enableStreaming: (req) => req.headers.get('user-agent') !== 'custom bot',
});
```

By default all pages are stream rendered except for SEO bots. There shouldn't be many reasons to disable streaming, unless there is a custom bot not covered by Hydrogen's bot detection.
