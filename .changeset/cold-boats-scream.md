---
'@shopify/hydrogen': minor
---

Fragments and their related types have been removed:

- ExternalVideoFragment and ExternalVideoFragmentFragment
- Model3DFragment and Model3DFragmentFragment
- ImageFragment and ImageFragmentFragment
- MoneyFragment and MoneyFragmentFragment
- UnitPriceFragment and UnitPriceFragmentFragment
- VideoFragment and VideoFragmentFragment
- MetafieldFragment and MetafieldFragmentFragment
- Seo fragments and types:
  - DefaultPageSeoFragment and DefaultPageSeoFragmentFragment
  - HomeSeoFragment and HomeSeoFragmentFragment
  - ProductSeoFragment and ProductSeoFragmentFragment
  - CollectionSeoFragment and CollectionSeoFragmentFragment
  - PageSeoFragment and PageSeoFragmentFragment
- MediaFile fragments and types:
  - MediaFileFragment and MediaFileFragmentFragment
  - MediaFileFragment_ExternalVideo_Fragment
  - MediaFileFragment_MediaImage_Fragment
  - MediaFileFragment_Model3d_Fragment
  - MediaFileFragment_Video_Fragment
- ProductFragment and ProductFragmentFragment

These fragments have been removed to reduce the chances of over-fetching (in other words, querying for fields you don't use) in your GraphQL queries. Please refer to the [Storefront API documentation](https://shopify.dev/api/storefront) for information and guides.
