---
'@shopify/hydrogen': minor
---

Fixes:

- Sub queries was not revalidating properly
- Unable to change cache-control on RSC (hydrate) responses to no-store
- RSC (hydrate) responses are getting ERR_HTTP_HEADERS_SENT error on the server side
