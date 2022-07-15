---
'@shopify/hydrogen': patch
---

`locale` calculation logic and docs have been updated to support Shopify languages with extended language subtags.

The following is how we calculate `locale`:
If the Shopify `language` includes a region, then this value is used to calculate the `locale` and `countryCode` is disregarded. For example, if `language` is `PT_BR` (Brazilian Portuguese), then `locale` is calculated as `PT-BR`.
If the `language` does not contain a region, for example `EN` (English) and a `countryCode` like `US` (United States), the calculated `locale` will merge both into `EN-US`.
