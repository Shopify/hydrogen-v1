---
'@shopify/hydrogen': patch
---

In cases where the initialVariantId is missing on the <ProductProvider />`, the`selectedVariantId`in the returned`object`from the useProduct()` hook will now use the first available variant or the first variant (if non are available).
