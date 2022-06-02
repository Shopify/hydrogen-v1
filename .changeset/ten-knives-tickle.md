---
'@shopify/hydrogen': patch
---

Workers context (e.g. `waitUntil`) is now scoped to the current request instead of globally available.
