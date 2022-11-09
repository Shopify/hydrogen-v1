---
'@shopify/hydrogen': patch
---

Add a helper method to get headers to proxy the online store. These headers are necessary to prevent the online store from throttling proxied requests:

```ts
import {getOnlineStorefrontHeaders} from '@shopify/hydrogen';

async function handleEvent(event) {
  const response = fetch(`https://hydrogen.shop/products/hydrogen`, {
    headers: getOnlineStorefrontHeaders(event.request),
  });

  return response;
}
```
