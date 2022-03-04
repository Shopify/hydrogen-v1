# Changelog

## 0.11.1

### Patch Changes

- [#770](https://github.com/Shopify/hydrogen/pull/770) [`71e0255`](https://github.com/Shopify/hydrogen/commit/71e0255ea48dc1caa34d2c05a1556cc0ce6d4ce9) Thanks [@mcvinci](https://github.com/mcvinci)! - Hydrogen docs: Framework and global hooks content updates

* [#761](https://github.com/Shopify/hydrogen/pull/761) [`1142647`](https://github.com/Shopify/hydrogen/commit/114264716bc8f3027e3e6395d523714adbc92014) Thanks [@frehner](https://github.com/frehner)! - Fix issue with components that take in the `as` prop not validating other props when a component is passed to `as`.

- [#752](https://github.com/Shopify/hydrogen/pull/752) [`b96179f`](https://github.com/Shopify/hydrogen/commit/b96179fdf960da52332a981e29a742b677826834) Thanks [@jplhomer](https://github.com/jplhomer)! - Ensure ProductSeo knows how to handle `featuredImage = null`

* [#774](https://github.com/Shopify/hydrogen/pull/774) [`052f148`](https://github.com/Shopify/hydrogen/commit/052f148e0d33029cdc2540afa5ead32825962f3a) Thanks [@frandiox](https://github.com/frandiox)! - Fix internal url usage in platforms like Vercel, which already provides protocol and host in `request.url`.

- [#744](https://github.com/Shopify/hydrogen/pull/744) [`2e487b7`](https://github.com/Shopify/hydrogen/commit/2e487b7e70fe0572538dc2a24b6b6b36ba9fc804) Thanks [@jplhomer](https://github.com/jplhomer)! - Switch to using Changesets for changelogs.

* [#775](https://github.com/Shopify/hydrogen/pull/775) [`d5b7ee1`](https://github.com/Shopify/hydrogen/commit/d5b7ee1d8312f64922d1f78afc82ec5ad4a3f457) Thanks [@cartogram](https://github.com/cartogram)! - In cases where the `initialVariantId` is missing on the `<ProductProvider />`, the `selectedVariantId` in the returned `object` from `useProduct()` will now use the first available variant _or_ the first variant (if non are available).

- [#773](https://github.com/Shopify/hydrogen/pull/773) [`b6a053e`](https://github.com/Shopify/hydrogen/commit/b6a053e774da443b5692dec51546f5558b3018ad) Thanks [@frandiox](https://github.com/frandiox)! - Fix server bundle name in cases where CSS or images are imported in server components.

* [#764](https://github.com/Shopify/hydrogen/pull/764) [`5e55da4`](https://github.com/Shopify/hydrogen/commit/5e55da4090692369ff6a3d57fbc6d29124bdf2e9) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Preload queries breaking fetch on Cloudfare [#764](https://github.com/Shopify/hydrogen/pull/764)

- [#763](https://github.com/Shopify/hydrogen/pull/763) [`ea2857a`](https://github.com/Shopify/hydrogen/commit/ea2857a515866f37f392bca5da8be1139c055a64) Thanks [@frehner](https://github.com/frehner)! - Client-side apps now have React's `StrictMode` component wrapping the whole app, with an option to disable it. If you do turn it off, it is recommended that you still include the `StrictMode` component at as high of a level as possible in your React tree.

  See also [React 17's docs](https://reactjs.org/docs/strict-mode.html) on `StrictMode`, and [React 18's updates](https://github.com/reactwg/react-18/discussions/19) to `StrictMode`.

* [#747](https://github.com/Shopify/hydrogen/pull/747) [`2d8ab7e`](https://github.com/Shopify/hydrogen/commit/2d8ab7e2a8038ff8b43e6e9398e0bb2da72220a0) Thanks [@mcvinci](https://github.com/mcvinci)! - Hydrogen docs: Preloaded queries and query timing

## [0.11.0] - 2022-02-24

- fix: respond with 404 if the route has no matches

### Added

- New React hook `useScriptLoader` is available to more easily load external scripts
- Add `totalQuantity` to the returned object from `useCart()`
- Export `ProductPrice` and `ProductMetafield` standalone components
- Added `useUrl` hook that allows the consumer to get the current url in server or client component
- Added logging option `showCacheApiStatus` and `cacheControlHeader` by @wizardlyhel in [#472](https://github.com/Shopify/hydrogen/pull/472)
- Pass HYDROGEN_ASSET_BASE_URL into config to set base URL for compiled assets
- Introduce Hydrogen the `<Link>` component and `useNavigate` hook for routing
- Add a default virtual entry-client in `/@shopify/hydrogen/entry-client` that can be used in `index.html`
- Enable early hydration when streaming
- Add variantId prop to `<ProductMetafield />` component [#730](https://github.com/Shopify/hydrogen/pull/730)
- Add query timing logging option `showQueryTiming` [#699](https://github.com/Shopify/hydrogen/pull/699)
- Add variantId prop to `<ProductPrice />` component
- Add `preload` option to `useQuery` and `useShopQuery` [#700](https://github.com/Shopify/hydrogen/pull/700)

### Breaking Change

- `<Model3D>` has been renamed to `<ModelViewer>`
- `<Product />` and `<CartLine />` aliases have been removed; use the original components `<ProductProvider />` and `<CartLineProvider />` instead. Their nested component aliases, such as `<Product.Image />`, have also been removed; in this example you should use `<ProductImage />`.
- Merge `/src/entry-server.jsx` entry point into `App.server.jsx`
- The following components had their prop name renamed. Refer to the documentation or [#627](https://github.com/Shopify/hydrogen/issues/627) for more details.
  - `<ExternalVideo />`: renamed video prop to data
  - `<Video />`: renamed video prop to data
  - `<Image>`: renamed image prop to data
  - `<MediaFile>`: renamed media prop to data
  - `<ModelViewer>`: renamed model prop to data
  - `<Metafield>`: renamed metafield prop to data
  - `<Money>`: renamed money prop to data
  - `<UnitPrice>`: renamed unitPrice prop to data, unitPriceMeasurement prop to measurement
  - `<ProductProvider>`: renamed product prop to data
  - `<CartProvider>`: renamed cart prop to data
- Helmet component has been renamed to Head
- Remove the `<SelectedVariantBuyNowButton />` component in favour of using `<BuyNowButton variantId={product.selectedVariant.id} />`
- `<SelectedVariantAddToCartButton />` has been removed; the `<AddToCartButton />` will now use the selectedVariant by default.
- Remove the `<SelectedVariantImage />` component in favour of using `<Image data={product.selectedVariant.image} />`
- Remove the `<SelectedVariantMetafield />` component in favour of using `<ProductMetafield variantId={product.selectedVariant.id} />`
- Remove the `<SelectedVariantShopPayButton />` component in favour of using `<ShopPayButton variantId={product.selectedVariant.id} />`
- Remove the `<SelectedVariantPrice/>` and `<SelectedVariantUnitPrice/>` component in favour of using `<ProductPrice variantId={product.selectedVariant.id} />`

### Changed

- Change `/react` RSC path to `/__rsc`
- `<ShopifyProvider>` can again be used in server components
- Use hashes as client component ids instead of absolute paths
- Transition away from deprecated currency selector in favor of country selector
- Simplify Helmet usage and make it compatible with RSC
- The `Seo.client` component has been moved from `src/components` to `@shopify/hydrogen`. The props of the `Seo.client` component also changed to always take in `type` and `data`. Refer to the [`Seo` component reference](../src/components/Seo/README.md) for more details. [#539](https://github.com/Shopify/hydrogen/pull/539)
- Standardize cache control header into caching strategies by @wizardlyhel in [#629](https://github.com/Shopify/hydrogen/pull/629)
- Target future release to use '2022-01' API Version
- Correct Typescript issue where `as` was a default prop for all components when it should not be
- Update types and docs for `useCart()` hook and `<CartProvider>`
- Track page load performance
- The following money components no longer allow the function-as-a-child (also known as "render props") pattern; see [#589](https://github.com/Shopify/hydrogen/pull/589)
  - `<Money>` Use `useMoney()` for customization
  - `<CartLinePrice>` Use `useMoney()` for customization
  - `<ProductPrice>` Use `useMoney()` for customization
  - `<SelectedVariantPrice>` Use `useMoney()` for customization
  - `<Metafield>` Use `useParsedMetafields()` for customization
  - `<ProductMetafield>` Use `useParsedMetafields()` for customization
  - `<SelectedVariantMetafield>` Use `useParsedMetafields()` for customization
  - `<UnitPrice>` Use `useMoney()` for customization
  - `<CartLines>` Use `useCart()` for customization
- `<Metafield>` now renders `ratings` as a `<span>` with text instead of stars; `multi_line_text_field` inside of a `<span>` instead of a `<div>`
- Use `featureImage` instead of images(first:1) on product query
- Update `react-helmet-async` to 1.2.3 and remove our custom types

### Fixed

- Fix index routes. See [#562](https://github.com/Shopify/hydrogen/issues/562)
- Fix missing server state on SSR pass
- Fix mobile navigation in example that scrolls the body underneath when shown by @Francismori7 in [#582](https://github.com/Shopify/hydrogen/pull/582)
- Add charset to content type in HTML responses
- Fix header shift when cart is opened by @Francismori7 in [#600](https://github.com/Shopify/hydrogen/pull/600)
- Fix bug where search param is not being pass along during RSC streaming call [#623](https://github.com/Shopify/hydrogen/pull/623)
- Allow custom entry-client filenames
- Clear browser fetch cache by @wizardlyhel in [#591](https://github.com/Shopify/hydrogen/pull/591)
- Cannot redefine property error when updating client components
- `ShopPayButton` supports quantities greater than 1. Also fixed issues with IDs in Storefront API version 2022-01
- Render error in `Gallery.client.jsx` component when product resource has an external video or no images.
- Ensure youtube external videos are embed compatible urls
- Prevent client components from being cached during development
- Backticks in HTML break RSC hydration.

### Removed

- <CartLineSelectedOptions /> and <CartLineAttributes /> components. These components used the “function-as-a-child” pattern which doesn’t allow the `children` prop to be serialized, preventing them from being rendered within Server components.

_Migration_

The functionality provided by these components can be replicated using the `useCartLine()` hook instead.

_Example_

```tsx
// Before
function SomeComponent() {
  return (
    <>
      <CartLineSelectedOptions as="ul" className="text-xs space-y-1">
        {({name, value}) => (
          <>
            {name}: {value}
          </>
        )}
      </CartLineSelectedOptions>
      <CartLineAttributes as="ul" className="text-sm space-y-1">
        {({key, value}) => (
          <>
            {key}: {value}
          </>
        )}
      </CartLineAttributes>
    </>
  );
}

// After
function SomeComponent() {
  const {merchandise} = useCartLine();

  return (
    <>
      <ul className="text-xs space-y-1">
        {merchandise.selectedOptions.map(({name, value}) => (
          <li key={name}>
            {name}: {value}
          </li>
        ))}
      </ul>
    </>
  );
}
```

- Remove `fetch` workaround
- Remove the following hooks. (All the same functionality can be retrieved through the `useCart()` hook)
  - `useCartAttributesUpdateCallback`
  - `useCartBuyerIdentityUpdateCallback`
  - `useCartCheckoutUrl`
  - `useCartCreateCallback`
  - `useCartDiscountCodesUpdateCallback`
  - `useCartLinesAddCallback`
  - `useCartLinesRemoveCallback`
  - `useCartLinesTotalQuantity`
  - `useCartLinesUpdateCallback`
  - `useCartNoteUpdateCallback`
- Remove React Router on the client
- Remove `handleEvent` in favor of `handleRequest`
- Remove `assetHandler` parameter in the new `handleRequest`
- `<SelectedVariantAddToCartButton />` has been removed; the `<AddToCartButton />` will now use the selectedVariant by default.
- Remove the `<SelectedVariantImage />` component in favour of using `<Image data={product.selectedVariant.image} />`
- Remove the `<SelectedVariantMetafield />` component in favour of using `<ProductMetafield variantId={product.selectedVariant.id} />`
- Remove the `<SelectedVariantBuyNowButton />` component in favour of using `<BuyNowButton variantId={product.selectedVariant.id} />`
- Remove the `<SelectedVariantShopPayButton />` component in favour of using `<ShopPayButton variantId={product.selectedVariant.id} />`

## [0.10.1] - 2022-01-26

### Fixed

- Hot reload for newly added page files

## [0.10.0] - 2022-01-25

### Changed

- Warn instead of error when a page server component is missing valid exports
- Adopt upstream version of React Server Components. See [#498](https://github.com/Shopify/hydrogen/pull/498) for breaking changes
- Bump to latest version of React experimental to include [upstream context bugfix](https://github.com/facebook/react/issues/23089)
- Improve API routes by allowing [strings and JS objects](https://github.com/Shopify/hydrogen/issues/476) to be returned.

### Breaking Change

- The 'locale' option in shopify.config.js had been renamed to 'defaultLocale'
- Rename `graphqlApiVersion` to `storefrontApiVersion` in `shopify.config.js`

### Fixed

- Make sure that API routes [hot reload properly](https://github.com/Shopify/hydrogen/issues/497)

## [0.9.1] - 2022-01-20

### Changed

- Transitive dependency bump.

## [0.9.0] - 2022-01-20

### Added

- API routes 🎉

### Changed

- Move to undici instead of node-fetch

## [0.8.3] - 2022-01-13

### Added

- Add optional `locale` param to `useShopQuery` to be used as `Accept-Language` in the store Storefront API query
- Optional purge query cache per build

### Fixed

- Replace log abbreviations with full text.

## [0.8.2] - 2022-01-07

### Changed

- Warn when requests take longer than 3000ms instead of erroring
- `useQuery` returns an error if the query's fetch was unsuccessful
- `useShopQuery` will give error hints to look at `shopify.config.js` when the Storefront API responds with a 403

### Fixed

- Load logger only once.
- Do not attempt to decode product IDs, as they are no longer base64-encoded in `unstable`

## [0.8.1] - 2022-01-04

### Added

- Detect bot user agents and give bots a non-streamed response.
- Add global `Oxygen.env` for server-only environment variables.
- Logging abstraction with default timing information

### Changed

- Upgrade to latest React 18 experimental version

### Fixed

- Cart decrease button removes at zero quantity

## [0.8.0] - 2021-12-07

### Fixed

- Export `CartLineSelectedOptions` properly
- Fix suspense utility function

## [0.7.1] - 2021-12-02

### Changed

- Allow `useShopQuery` to be skippable if no query is passed
- Remove usage of `react-query` (Not a breaking change)

### Fixed

- Avoid repeating the same identifier for default and named exports
- Remove sourcemap warnings

## [0.7.0] - 2021-11-22

### Added

- Add file reference metafield support
- Allow custom Model3D poster
- Support synchronous server redirects

### Fixed

- Binding of waitUntil in playground/server-components-worker
- Default to `retry: false` in `useQuery`
- Warn and ignore reserved properties in server state
- Run graphiql middleware before vite, fixing graphiql

## [0.6.4] - 2021-11-11

### Fixed

- Let Vite handle public assets in development
- New lines in hydration request break JSON.parse
- Normalize POSIX separators to support windows [#201](https://github.com/Shopify/hydrogen/pull/201)
- Scroll to top on app first load
- Update variantID to variantId [#78](https://github.com/Shopify/hydrogen/pull/78)

## [0.6.3] - 2021-11-10

### Fixed

- Add trailing slash to user components glob

## [0.6.2] - 2021-11-10

### Fixed

- Remove CartProvider from BuyNowButton
- Reading property of null for component props
- Transform deeply-imported client components
- Duplicated files and contexts in browser

## [0.6.1] - 2021-11-08

### Changed

- Transitive dependency bump.

### Fixed

- Do not set headers after they are sent to client

## [0.6.0] - 2021-11-05

### Changed

- Disable the quantity adjust button when the cart is not idle
- Use country server state in cart for the inContext directive
- Use Image url field instead of deprecated originalSrc field
- Switch to unstable API

### Fixed

- Update interaction prompt and interaction promp style attributes for Model3d
- Make sure all errors show an error dialog when hydrogen is in dev mode
- MediaFile component warning on non-Model3D types
- Remove console logs for caching
- Lowercased SVG tags in RSC
- Make the URL search property available via hooks

## 0.5.8 - 2021-11-04

### Fixed

- Ensure delayed callback is fired for cache purposes in Workers runtimes.

## 0.5.3 - 2021-11-02

### Changed

- No updates. Transitive dependency bump.

## 0.5.2 - 2021-11-02

### Changed

- No updates. Transitive dependency bump.

## 0.5.1 - 2021-11-02

### Changed

- No updates. Transitive dependency bump.

## 0.5.0 - 2021-11-01

### Fixed

- Update the ServerStateProvider context
- Add tabIndex to ShopPayButton
- Update LocalizationProvider query, context, and exports

## 0.4.3 - 2021-10-29

### Added

- Introduct full-page and sub-request caching API.

## 0.4.2 - 2021-10-29

### Changed

- Update Model3D props and add binding to model-viewer events

### Fixed

- Add `passthoughProps.disabled` to `AddToCartButton`
- Do not show undefined currency symbol in production

## 0.4.0 - 2021-10-27

### Added

- Add external image support to Image component

### Changed

- Make `CartProvider` a client-only concern. [#631](https://github.com/Shopify/hydrogen/pull/631)
- Use `Accept: application/hydrogen` as a header when making `fetch` calls against a Hydrogen page. Useful for Custom Responses.

### Fixed

- Lock model-viewer.js version to 1.8
- Use the Intl.NumberFormat parts for determining the amount value returned by the useMoney hook
- Optimize React related dependencies at server start to avoid page reloads
- Do not throw when `storeDomain` contains protocol.

## 0.3.0 - 2021-10-20

### Added

- Export utilities in client bundle

### Fixed

- `parseCookies` will split only on first =
- Make BuyNowButton a client component since it uses useEffect
- Preserve original aspect ratio for product images
- Invoke CartProvider callbacks before performing the GraphQL mutations
- Fix the accessible label in the AddToCartButton component when an item is added to cart
- Cart fetch to return stringified error

### Removed

- Remove sourcemap warnings

## 0.2.1 - 2021-10-12

### Fixed

- Starter template GalleryPreview unique key warning
- Mitigation for upcoming breaking minor Vite update

## 0.2.0 - 2021-10-08

### Added

- Added support for images and collections in the ProductProvider component
- Added more GraphQL fragments for building block components (Metafield, UnitPrice) and updated exports of these fragments

### Breaking Change

- `useQuery` now behaves exactly like [react-query's hook of the same name](https://react-query.tanstack.com/reference/useQuery#_top)

### Fixed

- Handle products with selling plans

## 0.1.2 - 2021-09-30

### Fixed

- SSR issue when running Vite 2.6
- Occasional `ProductProviderFragment` error when booting Hydrogen dev server [#571](https://github.com/Shopify/hydrogen/issues/571)

## 0.1.1 - 2021-09-24

### Added

- New GraphQL fragments for Variants, SellingPlans, and SellingPlanGroups

### Changed

- Updated types for the `useProductOptions` hook

### Fixed

- `Dynamic require of "stream" is not supported` error in browser logs

## 0.1.0 - 2021-09-23

### Changed

- No updates. Transitive dependency bump.

## 1.0.0-alpha.22 - 2021-09-22

### Changed

- No updates. Transitive dependency bump.

[0.6.0]: https://github.com/Shopify/hydrogen/releases/tag/v0.6.0
[0.6.1]: https://github.com/Shopify/hydrogen/releases/tag/v0.6.1
[0.6.2]: https://github.com/Shopify/hydrogen/releases/tag/v0.6.2
[0.6.3]: https://github.com/Shopify/hydrogen/releases/tag/v0.6.3
[0.6.4]: https://github.com/Shopify/hydrogen/releases/tag/v0.6.4
[0.7.0]: https://github.com/Shopify/hydrogen/releases/tag/v0.7.0
[0.7.1]: https://github.com/Shopify/hydrogen/releases/tag/v0.7.1
[0.8.0]: https://github.com/Shopify/hydrogen/releases/tag/v0.8.0
[0.8.1]: https://github.com/Shopify/hydrogen/releases/tag/v0.8.1
[0.8.2]: https://github.com/Shopify/hydrogen/releases/tag/v0.8.2
[0.8.3]: https://github.com/Shopify/hydrogen/releases/tag/v0.8.3
[0.9.0]: https://github.com/Shopify/hydrogen/releases/tag/v0.9.0
[0.9.1]: https://github.com/Shopify/hydrogen/releases/tag/v0.9.1
[0.10.0]: https://github.com/Shopify/hydrogen/releases/tag/v0.10.0
[0.10.1]: https://github.com/Shopify/hydrogen/releases/tag/v0.10.1
[0.11.0]: https://github.com/Shopify/hydrogen/releases/tag/v0.11.0
[unreleased]: https://github.com/Shopify/hydrogen/compare/v0.11.0...HEAD
