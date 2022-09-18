# @shopify/hydrogen-ui-alpha

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
