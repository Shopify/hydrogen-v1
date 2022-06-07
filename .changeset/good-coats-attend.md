---
'@shopify/hydrogen': minor
---

## `<ProductProvider/>` and `<ProductOptionsProvider/>`

- `<ProductProvider/>` has been removed
  - `<ProductPrice/>` was the only component left that used it; now it requires a `data` prop that takes in the product object
- `<ProductOptionsProvider/>` now maintains and provides the state that `useProductOptions` used to keep track of by itself. This change enables you to use multiple `useProductOptions` hook calls and have them share the same state (such as selected variant, options, etc.)
