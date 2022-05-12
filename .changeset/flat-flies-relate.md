---
'@shopify/hydrogen': patch
---

Hydrogen disables streaming and instead buffer renders the whole page for bot user agents.
Now you can add custom user agents within `hydrogen.config.js` by adding a `botUserAgents` property:

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
  botUserAgents: ['custom bot'],
});
```
