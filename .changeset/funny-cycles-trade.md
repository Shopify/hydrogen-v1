---
'@shopify/hydrogen': patch
---

In cases where the `initialVariantId` is missing on the `<ProductProvider />`, the `selectedVariantId` in the returned `object` from `useProduct()` will now use the first available variant _or_ the first variant (if non are available).
