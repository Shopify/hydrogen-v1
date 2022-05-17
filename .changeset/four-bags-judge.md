---
'@shopify/hydrogen': minor
---

Feature:

- Enable full page caching when available

Fixes:

- Sub queries was not revalidating properly
- Unable to change cache-control on RSC (hydrate) responses to no-store
- RSC (hydrate) responses are getting ERR_HTTP_HEADERS_SENT error on the server side
- Fix Oxygen env variable preventing streaming from happening
