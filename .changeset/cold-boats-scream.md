---
'@shopify/hydrogen': patch
---

Fragments and their related types have been removed:

- ExternalVideoFragment and ExternalVideoFragmentFragment
- Model3DFragment and Model3DFragmentFragment
- ImageFragment and ImageFragmentFragment
- MoneyFragment and MoneyFragmentFragment
- UnitPriceFragment and UnitPriceFragmentFragment
- VideoFragment and VideoFragmentFragment
- Seo fragments and types:
  - DefaultPageSeoFragment and DefaultPageSeoFragmentFragment
  - HomeSeoFragment and HomeSeoFragmentFragment
  - ProductSeoFragment and ProductSeoFragmentFragment
  - CollectionSeoFragment and CollectionSeoFragmentFragment
  - PageSeoFragment and PageSeoFragmentFragment

As part of the effort to reduce over-fetching in the GraphQL queries.
