---
'@shopify/hydrogen': patch
---

Fix: Hydrogen no longer caches error responses. Any 400 or 500 level response will not have a cache control-header, nor will Hydrogen cache it internally.
