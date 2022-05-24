---
'@shopify/hydrogen': minor
---

**Breaking Change**: `<Money />` updates and `<UnitPrice />` Removed.

- `<UnitPrice/>` has been removed
- `<Money/>` has two new props: `measurement` and `measurementSeparator` which do the work that `UnitPrice` used to do
- The TypeScript types for `<Money/>` have been improved and should provide a better typed experience now
