# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

- `<Model3D>` has been renamed to `<ModelViewer>`
- Fix index routes. See [#562](https://github.com/Shopify/hydrogen/issues/562)
- Feature - `<ShopifyProvider>` can again be used in server components
- dx: Correct Typescript issue where `as` was a default prop for all components when it should not be
- New React hook `useScriptLoader` is available to more easily load external scripts
- DX: Update types and docs for `useCart()` hook and `<CartProvider>`
- feat: Add `totalQuantity` to the returned object from `useCart()`
- Track page load performance
- dx: Export `ProductPrice` and `ProductMetafield` standalone components
- Fix missing server state on SSR pass
- Fix mobile navigation in example that scrolls the body underneath when shown by @Francismori7 in #582
- Use hashes as client component ids instead of absolute paths
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
- Feat: Transition away from deprecated currency selector in favor of country selector
- dx: The following money components no longer allow the function-as-a-child (also known as "render props") pattern; see #589.
  - `<Money>` Use `useMoney()` for customization
  - `<CartLinePrice>` Use `useMoney()` for customization
  - `<ProductPrice>` Use `useMoney()` for customization
  - `<SelectedVariantPrice>` Use `useMoney()` for customization
  - `<Metafield>` Use `useParsedMetafields()` for customization
  - `<ProductMetafield>` Use `useParsedMetafields()` for customization
  - `<SelectedVariantMetafield>` Use `useParsedMetafields()` for customization
- refactor: `<Metafield>` now renders `ratings` as a `<span>` with text instead of stars; `multi_line_text_field` inside of a `<span>` instead of a `<div>`
- Fix: add charset to content type in HTML responses
- Fix header shift when cart is opened by @Francismori7 in #600
- Feat: Simplify Helmet usage and make it compatible with RSC
- The `Seo.client` component has been moved from `src/components` to `@shopify/hydrogen`. The props of the `Seo.client` component also changed to always take in `type` and `data`. Refer to the [`Seo` component reference] (../src/components/Seo/README.md) for more details. [#539](https://github.com/Shopify/hydrogen/pull/539)
- feat: added `useUrl` hook that allows the consumer to get the current url in server or client component
- fix: fix bug where search param is not being pass along during RSC streaming call [#623](https://github.com/Shopify/hydrogen/pull/623)
- feat: expect collection seo by default
- fix: allow custom entry-client filenames.

## 0.10.1 - 2022-01-26

- Fix: hot reload for newly added page files

## 0.10.0 - 2022-01-25

- Warn instead of error when a page server component is missing valid exports
- Adopt upstream version of React Server Components. See [#498](https://github.com/Shopify/hydrogen/pull/498) for breaking changes.
- The 'locale' option in shopify.config.js had been renamed to 'defaultLocale'
- dx: rename `graphqlApiVersion` to `storefrontApiVersion` in `shopify.config.js`
- Bump to latest version of React experimental to include [upstream context bugfix](https://github.com/facebook/react/issues/23089)
- feature: improve API routes by allowing [strings and JS objects](https://github.com/Shopify/hydrogen/issues/476) to be returned.
- fix: make sure that API routes [hot reload properly](https://github.com/Shopify/hydrogen/issues/497)

## 0.9.1 - 2022-01-20

- No updates. Transitive dependency bump.

## 0.9.0 - 2022-01-20

- feature: API routes 🎉
- feature: move to undici instead of node-fetch

## 0.8.3 - 2022-01-13

- fix: replace log abbreviations with full text.
- feature: add optional `locale` param to `useShopQuery` to be used as `Accept-Language` in the store Storefront API query
- feature: Optional purge query cache per build

## 0.8.2 - 2022-01-07

- fix: load logger only once.
- fix: warn when requests take longer than 3000ms instead of erroring
- feat: `useQuery` returns an error if the query's fetch was unsuccessful
- feat: `useShopQuery` will give error hints to look at `shopify.config.js` when the Storefront API responds with a 403
- fix: do not attempt to decode product IDs, as they are no longer base64-encoded in `unstable`

## 0.8.1 - 2022-01-04

- feat: Detect bot user agents and give bots a non-streamed response.
- feat: Add global `Oxygen.env` for server-only environment variables.
- fix: cart decrease button removes at zero quantity
- feat: upgrade to latest React 18 experimental version
- docs: product provider tweaks
- docs: Document naming conventions
- feat: logging abstraction with default timing information

## 0.8.0 - 2021-12-07

- fix: export `CartLineSelectedOptions` properly
- fix: fix suspense utility function

## 0.7.1 - 2021-12-02

- fix: avoid repeating the same identifier for default and named exports
- fix: remove sourcemap warnings
- feat: allow `useShopQuery` to be skippable if no query is passed.
- fix: Remove usage of `react-query` (Not a breaking change)

## 0.7.0 - 2021-11-22

- feat: add file reference metafield support
- fix: binding of waitUntil in playground/server-components-worker
- fix: default to `retry: false` in `useQuery`
- fix: warn and ignore reserved properties in server state
- fix: run graphiql middleware before vite, fixing graphiql
- feat: allow custom Model3D poster
- feat: support synchronous server redirects

## 0.6.4 - 2021-11-11

- fix: let Vite handle public assets in development
- fix: new lines in hydration request break JSON.parse
- fix(#201): normalize POSIX separators to support windows
- fix: scroll to top on app first load
- fix(#78): update variantID to variantId

## 0.6.3 - 2021-11-10

- fix: add trailing slash to user components glob

## 0.6.2 - 2021-11-10

- fix: remove CartProvider from BuyNowButton
- fix: reading property of null for component props
- fix: transform deeply-imported client components
- fix: duplicated files and contexts in browser

## 0.6.1 - 2021-11-08

- No updates. Transitive dependency bump.

- fix: do not set headers after they are sent to client

## 0.6.0 - 2021-11-05

- feat: disable the quantity adjust button when the cart is not idle
- feat: use country server state in cart for the inContext directive
- fix: update interaction prompt and interaction promp style attributes for Model3d
- fix: make sure all errors show an error dialog when hydrogen is in dev mode
- feat: use Image url field instead of deprecated originalSrc field
- feat: switch to unstable API
- fix: MediaFile component warning on non-Model3D types
- fix: remove console logs for caching
- fix: lowercased SVG tags in RSC
- fix: make the URL search property available via hooks

## 0.5.8 - 2021-11-04

- Ensure delayed callback is fired for cache purposes in Workers runtimes.

## 0.5.3 - 2021-11-02

- No updates. Transitive dependency bump.

## 0.5.2 - 2021-11-02

- No updates. Transitive dependency bump.

## 0.5.1 - 2021-11-02

- No updates. Transitive dependency bump.

## 0.5.0 - 2021-11-01

- fix: update the ServerStateProvider context
- fix: add tabIndex to ShopPayButton
- fix: update LocalizationProvider query, context, and exports

## 0.4.3 - 2021-10-29

- feat: introduct full-page and sub-request caching API.

## 0.4.2 - 2021-10-29

- fix: add `passthoughProps.disabled` to `AddToCartButton`
- feat: update Model3D props and add binding to model-viewer events
- fix: do not show undefined currency symbol in production

## 0.4.0 - 2021-10-27

- fix: lock model-viewer.js version to 1.8
- Make `CartProvider` a client-only concern. [#631](https://github.com/Shopify/hydrogen/pull/631)
- fix: use the Intl.NumberFormat parts for determining the amount value returned by the useMoney hook
- fix: optimize React related dependencies at server start to avoid page reloads
- feat: add external image support to Image component
- feat: Use `Accept: application/hydrogen` as a header when making `fetch` calls against a Hydrogen page. Useful for Custom Responses.
- fix: do not throw when `storeDomain` contains protocol.

## 0.3.0 - 2021-10-20

- feat: export utilities in client bundle
- fix: parseCookies will split only on first =
- fix: make BuyNowButton a client component since it uses useEffect
- fix: preserve original aspect ratio for product images
- fix: invoke CartProvider callbacks before performing the GraphQL mutations
- fix: fix the accessible label in the AddToCartButton component when an item is added to cart
- fix: cart fetch to return stringified error
- fix: remove sourcemap warnings

## 0.2.1 - 2021-10-12

- fix: starter template GalleryPreview unique key warning
- fix: Mitigation for upcoming breaking minor Vite update

## 0.2.0 - 2021-10-08

- fix: handle products with selling plans
- Added support for images and collections in the ProductProvider component
- Added more GraphQL fragments for building block components (Metafield, UnitPrice) and updated exports of these fragments.
- BREAKING CHANGE: `useQuery` now behaves exactly like [react-query's hook of the same name](https://react-query.tanstack.com/reference/useQuery#_top).

## 0.1.2 - 2021-09-30

- fix: SSR issue when running Vite 2.6
- fix: occasional `ProductProviderFragment` error when booting Hydrogen dev server [#571](https://github.com/Shopify/hydrogen/issues/571)

## 0.1.1 - 2021-09-24

- New GraphQL fragments for Variants, SellingPlans, and SellingPlanGroups
- Updated types for the `useProductOptions` hook
- fix: `Dynamic require of "stream" is not supported` error in browser logs

## 0.1.0 - 2021-09-23

- No updates. Transitive dependency bump.

## 1.0.0-alpha.22 - 2021-09-22

- No updates. Transitive dependency bump.
