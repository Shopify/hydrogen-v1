---
'@shopify/hydrogen': minor
---

Switch to Node 16 as the minimum node version. Also switch to [undici](https://github.com/nodejs/undici) for web/Fetch polyfills. Technically this is a breaking change, because there are slight differences between the node-fetch@2.x API and undici.
