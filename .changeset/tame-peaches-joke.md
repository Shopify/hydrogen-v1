---
'@shopify/hydrogen': patch
---

Improve error handling:

1. Improve how errors are default presented in the logs.
1. Make sure that when useShopQuery fails, that an Error object is propagated.
