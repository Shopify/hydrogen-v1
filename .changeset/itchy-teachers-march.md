---
'@shopify/hydrogen': minor
---

`<CartEstimatedCost/>` has been renamed to `<CartCost/>` to match a recent update to the Storefront API, in which `cart.estimatedCost` is being deprecated in favor of `cart.cost`.

Additionally, `cart.cost.compareAtAmount` was renamed to `cart.cost.compareAtAmountPerQuantity`.
