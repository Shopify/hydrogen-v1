---
'@shopify/hydrogen': patch
---

Remove Router client-only logic from server bundle and avoid extra waterfall requests during Hydration.
Extract part of the client bundle into separate modules that can be loaded in parallel.
