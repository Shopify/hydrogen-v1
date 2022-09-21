---
'@shopify/hydrogen-ui-alpha': patch
---

Updated `createStorefrontClient()`:

- Completely remove `storefrontId`
- Add ability to customize `contentType` on every invocation of `getPublicTokenHeaders()` and `getPrivateTokenHeaders()`
- Fix and update TypeScript type explanations
- Update README docs

Also updated the README with additional docs on restarting the GraphQL server in your IDE.
