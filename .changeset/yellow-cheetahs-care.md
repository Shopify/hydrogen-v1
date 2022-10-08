---
'@shopify/hydrogen': minor
---

Updated the Storefront API version of Hydrogen to the `2022-10` release.

**This is a backwards-compatible change**; if you are still on the `2022-07` version, you may stay on that version without any issues. However, it is still recommended that you upgrade to `2022-10` as soon as possible.

For more information about the Storefront API, refer to:

- The [versioning documentation](https://shopify.dev/api/usage/versioning)
- The [`2022-10` release notes](https://shopify.dev/api/release-notes/2022-10#graphql-storefont-api-changes). Take note that Hydrogen never used the `Money` fields internally, so the breaking change listed there does not affect Hydrogen.
