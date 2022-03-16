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

As part of the effort to reduce over-fetching in the GraphQL queries.
