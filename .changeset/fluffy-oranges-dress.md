---
'@shopify/hydrogen': minor
---

## `<Money/>` and `<UnitPrice/>`

- `<UnitPrice/>` has been removed
- `<Money/>` has two new props: `measurement` and `measurementSeparator` which do the work that `UnitPrice` used to do
- The TypeScript types for `<Money/>` have been improved and should provide a better typed experience now
