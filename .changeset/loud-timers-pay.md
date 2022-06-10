---
'@shopify/hydrogen': patch
---

Add a built-in healthcheck route available at `/__health`. It responds with a 200 and no body. Also suppresses server logs for built-in routes like healthcheck and analytics.
