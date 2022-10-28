# @shopify/hydrogen-ui-alpha

This alpha package is now deprecated. You can find the final package and code at https://github.com/shopify/hydrogen-ui and https://www.npmjs.com/package/@shopify/hydrogen-react

## 2022.7.5

### Patch Changes

- Updated `createStorefrontClient()`: ([#2172](https://github.com/Shopify/hydrogen/pull/2172)) by [@frehner](https://github.com/frehner)

  - Completely remove `storefrontId`
  - Add ability to customize `contentType` on every invocation of `getPublicTokenHeaders()` and `getPrivateTokenHeaders()`
  - Fix and update TypeScript type explanations
  - Update README docs

  Also updated the README with additional docs on restarting the GraphQL server in your IDE.

* Fix storefrontId from required to optional param ([#2162](https://github.com/Shopify/hydrogen/pull/2162)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Several updates and changes: ([#2171](https://github.com/Shopify/hydrogen/pull/2171)) by [@frehner](https://github.com/frehner)

  - Migrate `<ProductPrice />` component, and the associated tests. Also create a story file
  - Allow `<ShopifyProvider />`'s `data` prop to have more optional properties
  - Fix issue with `<MediaFile />` not being exported

* Updated the `createStorefrontClient()` helper: ([#2160](https://github.com/Shopify/hydrogen/pull/2160)) by [@frehner](https://github.com/frehner)

  - Stopped warning on missing `storefrontId` for now
  - You can now set the default `"content-type"` by passing in `createStorefrontClient({contentType: 'json' | 'graphql' })`. Defaults to `json` (previous default was `graphql`)
  - Removed the ability to pass in the `buyerIp` when using `getPublicTokenHeaders()` as it's not used by the Storefront API

  Also updated some fields in `package.json` to improve the experience when on `npmjs.com`.

## 2022.7.4

### Patch Changes

- - Added `<ProductProvider/>` (which is equivalent to `<ProductOptionsProvider/>` in Hydrogen) ([#2099](https://github.com/Shopify/hydrogen/pull/2099)) by [@frehner](https://github.com/frehner)

  - Added `useProduct()` (which is equivalent to `useProductOptions()` in Hydrogen)

* Added ([#2089](https://github.com/Shopify/hydrogen/pull/2089)) by [@frehner](https://github.com/frehner)

  - `<Metafields />` component
  - `flattenConnection()` function
  - `parseMetafield()` function
  - `parseMetafieldValue()` function

- Fix package exports and remove the `browser` field. ([#2120](https://github.com/Shopify/hydrogen/pull/2120)) by [@frehner](https://github.com/frehner)

* - Migrated `<ModelViewer />`, and also improved the types for it as well - the types now come directly from the `@google/model-viewer` repo. ([#2115](https://github.com/Shopify/hydrogen/pull/2115)) by [@frehner](https://github.com/frehner)

  - Migrated `<MediaFile />` and implemented the `mediaOptions` prop for it as outlined in https://github.com/Shopify/hydrogen/issues/686

- Add `createStorefrontClient` and related documentation, to improve the developer experience when querying the Storefront API. ([#2140](https://github.com/Shopify/hydrogen/pull/2140)) by [@frehner](https://github.com/frehner)

* Add TypeScript type helpers for correctly setting the return types from the Storefront API. ([#2122](https://github.com/Shopify/hydrogen/pull/2122)) by [@frehner](https://github.com/frehner)

## 2022.7.3

### Patch Changes

- Update Image to better handle no data sources in production builds ([#2069](https://github.com/Shopify/hydrogen/pull/2069)) by [@frehner](https://github.com/frehner)

## 2022.7.2

### Patch Changes

- Publish for reals this time. by [@frehner](https://github.com/frehner)

## 2022.7.1

### Patch Changes

- Initial release ([#2064](https://github.com/Shopify/hydrogen/pull/2064)) by [@frehner](https://github.com/frehner)
