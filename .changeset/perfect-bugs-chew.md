---
'@shopify/hydrogen-ui-alpha': patch
---

Updated the `createStorefrontClient()` helper:

- Stopped warning on missing `storefrontId` for now
- You can now set the default `"content-type"` by passing in `createStorefrontClient({contentType: 'json' | 'graphql' })`. Defaults to `json` (previous default was `graphql`)
- Removed the ability to pass in the `buyerIp` when using `getPublicTokenHeaders()` as it's not used by the Storefront API

Also updated some fields in `package.json` to improve the experience when on `npmjs.com`.
