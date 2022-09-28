---
'@shopify/hydrogen': patch
---

Fix imports from `@shopify/hydrogen/experimental` at build time. Previously, importing from this path would end up in unresolved client components.
