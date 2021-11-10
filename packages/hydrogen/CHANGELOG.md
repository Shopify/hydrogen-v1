# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

- fix(#201): normalize POSIX separators to support windows

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
