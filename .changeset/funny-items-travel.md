---
'@shopify/hydrogen': patch
---

`locale` calculation logic and docs have been updated to support Shopify languages with extended language subtags.

`locale` is now calculated like this:
Given a Shopify `language` that includes a region, for example `PT_BR` (Portuguese from Brazil), the calculated `locale` will be `PT-BR` disregarding `countryCode`.
If the `language` does not contain a region, for example `EN` (English) and a `countryCode` like `US` (United States), the calculated `locale` will merge both into `EN-US`.
