---
'@shopify/hydrogen': patch
---

`locale` calculation logic and docs have been updated to support Shopify languages with extended language subtags.

The following is how we calculate `locale`:
If the Shopify `language` includes a region, then this value is used to calculate the `locale` and `countryCode` is disregarded. For example, if `language` is `PT_BR` (Brazilian Portuguese), then `locale` is calculated as `PT-BR`.
If the Shopify `language` doesn't include a region, then this value is merged with the `countryCode` to calculate the `locale`. For example, if `language` is `EN` (English) and `countryCode` is `US` (United States), then `locale` is calculated as `EN-US`.
