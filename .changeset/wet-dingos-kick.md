---
'@shopify/hydrogen': minor
---

Updated Cart queries in two ways, one of which requires you to be using Storefront API `2022-07`:

1. [`CartLine`](https://shopify.dev/api/storefront/2022-04/objects/CartLine#fields) now uses [`CartLineEstimatedCost`'s `totalAmount`](https://shopify.dev/api/storefront/2022-04/objects/CartLineEstimatedCost) field for calculating the Line's total, instead of doing it manually.
2. Cart now uses [`totalQuantiy`](https://shopify.dev/api/storefront/2022-07/objects/Cart#field-cart-totalquantity) for calculating how many items are in the cart, instead of doing this manually. **Note that this feature is only available in Storefront API `2022-07` and newer.**
