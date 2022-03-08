# Changelog

## 0.12.0

### Minor Changes

- [#858](https://github.com/Shopify/hydrogen/pull/858) [`eae3490`](https://github.com/Shopify/hydrogen/commit/eae3490bf630c92243e9e6820100d673e22ec421) Thanks [@michenly](https://github.com/michenly)! - Upgrade default Storefront API to version '2022-04'. Some components have been updated to use the 2022-04 features and types as well.

  One important change is that the `2022-04` Storefront API no longer encodes object IDs: see more [details here](https://shopify.dev/api/release-notes/2022-04#non-encoded-object-ids-in-the-graphql-storefront-api). Because of this, Hydrogen will no longer decode IDs, either, which will cause issues if you are using a previous version of the Storefront API with Hydrogen components.

* [#858](https://github.com/Shopify/hydrogen/pull/858) [`eae3490`](https://github.com/Shopify/hydrogen/commit/eae3490bf630c92243e9e6820100d673e22ec421) Thanks [@michenly](https://github.com/michenly)! - Adds `queryShop` helper to API routes. This makes it easy to query the Storefront API, similar to how `useShopQuery` is available in server components:

  ```jsx
  // my-api.server.js

  export default function api(request, {queryShop}) {
    return await queryShop({
      query: `query ShopName { shop { name } }`,
    });
  }
  ```

  `queryShop` accepts a single argument object with the following properties:

  | Property    | Type                                   | Required |
  | ----------- | -------------------------------------- | -------- |
  | `query`     | `string \| ASTNode`                    | Yes      |
  | `variables` | `Record<string, any>`                  | No       |
  | `locale`    | `string` (defaults to `defaultLocale`) | No       |

  **Important**: In order to use `queryShop`, you should pass `shopifyConfig` to `renderHydrogen` inside `App.server.jsx`:

  ```diff
  -export default renderHydrogen(App, {routes});
  +export default renderHydrogen(App, {shopifyConfig, routes});
  ```

- [#858](https://github.com/Shopify/hydrogen/pull/858) [`eae3490`](https://github.com/Shopify/hydrogen/commit/eae3490bf630c92243e9e6820100d673e22ec421) Thanks [@michenly](https://github.com/michenly)! - Routing in Hydrogen has been updated according to [Custom Routes proposal](https://github.com/Shopify/hydrogen/discussions/569). Specifically, a new `Router` component has been added, and `DefaultRoutes` has been renamed to `FileRoutes`, along with other minor changes. Custom route components are not implemented yet.

  Follow these steps to upgrade your `App.server.jsx` file:

  1. Rename the parameter `pages` to `routes` when calling `renderHydrogen`.
  2. Rename the `DefaultRoutes` component to `FileRoutes`.
  3. Add the new `Router` component as a parent of `FileRoutes` and pass `fallback` and `serverProps` props (previously in `DefaultRoutes`).
  4. Rename `src/pages` directory to `src/routes` and update the glob import in `App.server.jsx` to `import.meta.globEager('./routes/**/*.server.[jt](s|sx)')`.

  #### Full example of `App.server.jsx`

  ```jsx
  import renderHydrogen from '@shopify/hydrogen/entry-server';
  import {Router, FileRoutes, ShopifyProvider} from '@shopify/hydrogen';
  import {Suspense} from 'react';
  import shopifyConfig from '../shopify.config';
  import DefaultSeo from './components/DefaultSeo.server';
  import NotFound from './components/NotFound.server';
  import LoadingFallback from './components/LoadingFallback';
  import CartProvider from './components/CartProvider.client';

  function App({routes, ...serverProps}) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ShopifyProvider shopifyConfig={shopifyConfig}>
          <CartProvider>
            <DefaultSeo />
            <Router fallback={<NotFound />} serverProps={serverProps}>
              <FileRoutes routes={routes} />
            </Router>
          </CartProvider>
        </ShopifyProvider>
      </Suspense>
    );
  }

  const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');
  export default renderHydrogen(App, {shopifyConfig, routes});
  ```

### Patch Changes

- [#858](https://github.com/Shopify/hydrogen/pull/858) [`eae3490`](https://github.com/Shopify/hydrogen/commit/eae3490bf630c92243e9e6820100d673e22ec421) Thanks [@michenly](https://github.com/michenly)! - Export Seo components Fragement and use them in the starter template.

* [#852](https://github.com/Shopify/hydrogen/pull/852) [`6015edf`](https://github.com/Shopify/hydrogen/commit/6015edfa01f7c8e3e7a0120db0847bdc1c068263) Thanks [@frandiox](https://github.com/frandiox)! - Update @headlessui/react version to fix Cart dialog not opening.

## 0.11.0 - 2022-02-24

- feat: update favicon
- feat: HelmetProvider has been removed
- feat: `/src/entry-server.jsx` file has been merged into `App.server.jsx`. The latter is the new default entry point for the server
- feat: `/src/entry-client.jsx` file has been removed. The new entry point in for the client in `index.html` is `/@shopify/hydrogen/entry-client`. Custom entry points are still supported
- fix: Footer date update
- fix: product link errors in Cart.client.jsx of the example template
- feat: Helmet component has been renamed to Head

## 0.10.1 - 2022-01-26

- fix: Wrong prop in HelmetProvider breaking SEO

## 0.10.0 - 2022-01-25

- fix: Update Node 14 to Node 16 in DevContainer

## 0.9.1 - 2022-01-20

- No updates. Transitive dependency bump.

## 0.9.0 - 2022-01-20

- No updates. Transitive dependency bump.

## 0.8.3 - 2022-01-13

- No updates. Transitive dependency bump.

## 0.8.2 - 2022-01-07

- No updates. Transitive dependency bump.

## 0.8.1 - 2022-01-04

- Upgrade to latest React 18 experimental version
- Upgrade to Tailwind v3

## 0.8.0 - 2021-12-07

- Lowercase `index.server.jsx` filename to match others

## 0.7.1 - 2021-12-02

- Change `ProductCard` and `FeaturedCollection` from server components to shared components
- Use `eslint-plugin-hydrogen` recommended config for JS linting
- fix: 404 Page > Variable not declared

## 0.7.0 - 2021-11-22

- Devcontainer support added [#164](https://github.com/Shopify/hydrogen/pull/164)
- fix: add check for products.length in `Welcome.server.jsx`
- BREAKING CHANGE: the previously default export from `@shopify/hydrogen/middleware` is now a named export `hydrogenMiddleware`.
- fix: starter template media gallery error when handling videos
- fix: add 404 link to footer
- fix: align font styles for h1 and paragraph

## 0.6.4 - 2021-11-11

- No updates. Transitive dependency bump.

## 0.6.3 - 2021-11-10

- No updates. Transitive dependency bump.

## 0.6.2 - 2021-11-10

- Wrap instances of `<Money>` in client components due to render prop usage
- Eliminate use of `Link` client re-exports
- fix: gallery safari grid layout
- fix: Move `LocalizationProvider` to `Layout.server` to prevent issues with React Router & Suspense

## 0.6.1 - 2021-11-08

- Wrap LocalizationProvider in a proper Suspense boundary
- Optimize `@headlessui/react` to prevent dev server slowness while we investigate a long term solution

## 0.6.0 - 2021-11-05

- No updates. Transitive dependency bump.

## 0.5.8 - 2021-11-04

- No updates. Transitive dependency bump.

## 0.5.7 - 2021-11-02

- No updates. Transitive dependency bump.

## 0.5.6 - 2021-11-02

- No updates. Transitive dependency bump.

## 0.5.5 - 2021-11-02

- No updates. Transitive dependency bump.

## 0.5.4 - 2021-11-02

- No updates. Transitive dependency bump.

## 0.5.0 - 2021-11-01

- No updates. Transitive dependency bump.

## 0.4.3 - 2021-10-29

- feat: add opinionated defaults for caching

## 0.4.2 - 2021-10-29

- fix: create-hydrogen-app creation script
- fix: pick first template (if only one exists) [#746](https://github.com/Shopify/hydrogen/pull/746)

## 0.4.1 - 2021-10-27

- No updates. Transitive dependency bump.

## 0.4.0 - 2021-10-27

- fix: `yarn create hydrogen-app` command

### Changed

- `CartProvider` is now a client-only concern. [#631](https://github.com/Shopify/hydrogen/pull/631)

## 0.3.0 - 2021-10-20

- No updates. Transitive dependency bump.

## 0.2.1 - 2021-10-12

- No updates. Transitive dependency bump.

## 0.2.0 - 2021-10-08

- No updates. Transitive dependency bump.

## 0.1.3 - 2021-10-04

- No updates. Transitive dependency bump.

## 0.1.2 - 2021-09-30

- Bump `vite` to ^2.6.0

## 0.1.1 - 2021-09-24

- No updates. Transitive dependency bump.

## 0.1.0 - 2021-09-23

- fix: support starter template homepage without at least three products

## 1.0.0-alpha.23 - 2021-09-22

- fix: reduce NPM package size by skipping `node_modules` etc

## 1.0.0-alpha.22 - 2021-09-22

- No updates. Transitive dependency bump.
