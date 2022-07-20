---
'@shopify/hydrogen': patch
---

Fix: Hydrogen no longer caches 500 responses. Any 500 response will not have a cache control-header, nor will Hydrogen cache it internally.
