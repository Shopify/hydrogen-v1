---
'template-hydrogen-default': minor
'@shopify/hydrogen-cli': minor
'@shopify/hydrogen': minor
'test-server-components': minor
---

Upgrade default Storefront API to version '2022-04'. Some components have been updated to use the 2022-04 features and types as well.

One important change is that the `2022-04` Storefront API no longer encodes object IDs: see more [details here](https://shopify.dev/api/release-notes/2022-04#non-encoded-object-ids-in-the-graphql-storefront-api). Because of this, Hydrogen will no longer decode IDs, either, which will cause issues if you are using a previous version of the Storefront API with Hydrogen components.
