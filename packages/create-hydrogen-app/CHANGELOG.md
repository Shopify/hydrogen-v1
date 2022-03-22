# Changelog

## 0.13.0

### Minor Changes

- [#912](https://github.com/Shopify/hydrogen/pull/912) [`de0e0d6a`](https://github.com/Shopify/hydrogen/commit/de0e0d6a6652463243ee09013cd30830ce2a246a) Thanks [@blittle](https://github.com/blittle)! - Change the country selector to lazy load available countries. The motivation to do so is that a _lot_ of countries come with the starter template. The problem is 1) the graphql query to fetch them all is relatively slow and 2) all of them get serialized to the browser in each RSC response.

  This change removes `availableCountries` from the `LocalizationProvider`. As a result, the `useAvailableCountries` hook is also gone. Instead, the available countries are loaded on demand from an API route.

  Migratation steps:

  Create an API route to retrieve available countries:

  ```jsx
  export async function api(request, {queryShop}) {
    const {
      data: {
        localization: {availableCountries},
      },
    } = await queryShop({
      query: QUERY,
    });

    return availableCountries.sort((a, b) => a.name.localeCompare(b.name));
  }

  const QUERY = `
    query Localization {
      localization {
        availableCountries {
          isoCode
          name
          currency {
            isoCode
          }
        }
      }
    }
  `;
  ```

  Then within your client code, query the API route with a `useEffect` hook:

  ```jsx
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch('/api/countries')
      .then((resp) => resp.json())
      .then((c) => setCountries(c))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);
  ```

  See an example on how this could be done inside the Hydrogen Example Template [country selector](https://github.com/Shopify/hydrogen/blob/v1.x-2022-07/examples/template-hydrogen-default/src/components/CountrySelector.client.jsx)

* [#698](https://github.com/Shopify/hydrogen/pull/698) [`6f30b9a1`](https://github.com/Shopify/hydrogen/commit/6f30b9a1327f06d648a01dd94d539c7dcb3061e0) Thanks [@jplhomer](https://github.com/jplhomer)! - Basic end-to-end tests have been added to the default Hydrogen template. You can run tests in development:

  ```bash
  yarn test
  ```

  Or in continuous-integration (CI) environments:

  ```bash
  yarn test:ci
  ```

- [#846](https://github.com/Shopify/hydrogen/pull/846) [`58c823b5`](https://github.com/Shopify/hydrogen/commit/58c823b5eb5c5c33caa25cae629409ce651b3991) Thanks [@blittle](https://github.com/blittle)! - ## New `<Route>` Component

  The `<Route>` component is available for routes not defined by the file system. The `<Route>` component must be used within the `<Router>` component.

  ```jsx
  // app.server.jsx

  function App({routes, ...serverProps}) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ShopifyProvider shopifyConfig={shopifyConfig}>
          <CartProvider>
            <DefaultSeo />
            <Router serverProps={serverProps}>
              <Route path="/custom" page={<CustomRoute />} />
            </Router>
          </CartProvider>
        </ShopifyProvider>
      </Suspense>
    );
  }

  function CustomRoute() {
    return <h1>Custom route</h1>;
  }
  ```

  `<Route>` accepts two props:

  | Property | Type                                    | Required | Description                                                                                            |
  | -------- | --------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
  | `path`   | `string`                                | Yes      | The URL path where the route exists. The path can contain variables. For example, `/products/:handle`. |
  | `page`   | `A rendered Server Component reference` | Yes      | A reference to a React Server Component that's rendered when the route is active.                      |

  ## Changes to `<Router>`

  You can have multiple `<Route>` and `<FileRoutes>` components in your app. Hydrogen will only render one route for each request — whichever it finds first. This means the `<Router>` component no longer takes `fallback` as a prop. It also doesn't need `serverProps`. Instead, to render a 404 "Not Found" page, add `<Route path="*" page={<NotFound />} />` to your app. Make sure it's the last `<Route>` defined inside your app:

  ```diff
  function App({routes, ...serverProps}) {
    return (
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <CartProvider>
          <DefaultSeo />
  -       <Router
  -         fallback={<NotFound response={serverProps.response} />}
  -         serverProps={serverProps}
  -       >
  +       <Router>
            <FileRoutes routes={routes} />
  +         <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
      </ShopifyProvider>
    );
  }
  ```

  ## Changes to `<FileRoutes>`

  The `<FileRoutes>` component now accepts two additional optional props:

  | Property    | Type     | Required | Default Value | Description                                                             |
  | ----------- | -------- | -------- | ------------- | ----------------------------------------------------------------------- |
  | `basePath`  | `string` | No       | `"/"`         | A path that's prepended to all file routes.                             |
  | `dirPrefix` | `string` | No       | `"./routes"`  | The portion of the file route path that shouldn't be a part of the URL. |

  You need to modify `dirPrefix` if you want to import routes from a location other than `src/routes`.

  You can modify `basePath` if you want to prefix all file routes. For example, you can prefix all file routes with a locale:

  ```jsx
  <Router>
    <FileRoutes basePath={`/${locale}`} routes={routes} />
    <Route path="*" page={<NotFound />} />
  </Router>
  ```

  ## New `useRouteParams()` hook

  You can use the `useRouteParams()` hook to retrieve the parameters of an active route. The hook is available in both server and client components:

  ```jsx
  // products/[handle].server.jsx

  import {useRouteParams} from '@shopify/hydrogen';

  export default function Product() {
    const {handle} = useRouteParams();
    // ...
  }
  ```

  ```jsx
  // ProductDetails.client.jsx
  import {useRouteParams} from '@shopify/hydrogen/client';

  export default function ProductDetails() {
    const {handle} = useRouteParams();
    // ...
  }
  ```

* [#842](https://github.com/Shopify/hydrogen/pull/842) [`626e58ee`](https://github.com/Shopify/hydrogen/commit/626e58eebe3cf994423895bbdf7754c009d701fe) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Removed the `Rawhtml` component.

  Upgrade your project by replacing references to the `RawHtml` component to follow
  [React's `dangerouslySetInnerHTML`](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml):

  Change all `RawHtml` component

  ```jsx
  <RawHtml string="<p>Hello world</p>" />
  ```

  to jsx equivalent

  ```jsx
  <div dangerouslySetInnerHTML={{__html: '<p>Hello world</p>'}} />
  ```

### Patch Changes

- [#906](https://github.com/Shopify/hydrogen/pull/906) [`4db9534c`](https://github.com/Shopify/hydrogen/commit/4db9534ccf2a7a1579eb5e61b039f3c9a2ab49a8) Thanks [@blittle](https://github.com/blittle)! - Optimize the GraphQL query for the home page

* [#965](https://github.com/Shopify/hydrogen/pull/965) [`cdad13ed`](https://github.com/Shopify/hydrogen/commit/cdad13ed85ff17b84981367f39c7d2fe45e72dcf) Thanks [@blittle](https://github.com/blittle)! - Fix server redirects to work properly with RSC responses. For example, the redirect component within the starter template needs to change:

  ```diff
  export default function Redirect({response}) {
  -  response.redirect('/products/snowboard');
  -  return <div>This page is redirected</div>;
  +  return response.redirect('/products/snowboard');
  }
  ```

  This server component is rendered two ways:

  1. When an app directly loads the redirect route, the server will render a 300 redirect with the proper location header.
  2. The app is already loaded, but the user navigates to the redirected route. We cannot 300 respond in this scenario, instead `response.redirect(...)` returns a component which will redirect on the client.

- [#758](https://github.com/Shopify/hydrogen/pull/758) [`0bee3af0`](https://github.com/Shopify/hydrogen/commit/0bee3af0373acad85dba38a630d3a81e52d6c134) Thanks [@frandiox](https://github.com/frandiox)! - Upgrade to React experimental version `0.0.0-experimental-2bf7c02f0-20220314`.

  To upgrade your Hydrogen app, change the pinned version of `react` and `react-dom` in your `package.json` file to this version, or run:

  ```bash
  yarn add @shopify/hydrogen react@0.0.0-experimental-2bf7c02f0-20220314 react-dom@0.0.0-experimental-2bf7c02f0-20220314
  ```

* [#917](https://github.com/Shopify/hydrogen/pull/917) [`be888259`](https://github.com/Shopify/hydrogen/commit/be888259590b838c494bf10f4facdf7db85779b2) Thanks [@jplhomer](https://github.com/jplhomer)! - Add accessible button label for mobile navigation

- [#918](https://github.com/Shopify/hydrogen/pull/918) [`5699e0e9`](https://github.com/Shopify/hydrogen/commit/5699e0e9b7f5003812e31c470b5def5ba129f005) Thanks [@michenly](https://github.com/michenly)! - Optimize the GraphQL query for products page

* [#926](https://github.com/Shopify/hydrogen/pull/926) [`0ca1a039`](https://github.com/Shopify/hydrogen/commit/0ca1a039e18df8ff5de1f988ab0b1fd7ad9dfcfc) Thanks [@frandiox](https://github.com/frandiox)! - Added a new default worker entry point that uses module syntax in `@shopify/hydrogen/platforms/worker`.

- [#903](https://github.com/Shopify/hydrogen/pull/903) [`dd33f7ef`](https://github.com/Shopify/hydrogen/commit/dd33f7ef0bb17b0309f57f0b2a469a7e25ff3447) Thanks [@blittle](https://github.com/blittle)! - Optimize the GraphQL query for the NotFound.server.jsx page

* [#897](https://github.com/Shopify/hydrogen/pull/897) [`c01044e6`](https://github.com/Shopify/hydrogen/commit/c01044e6b4ebe74f8e2e310e78dbaa8178536016) Thanks [@blittle](https://github.com/blittle)! - Add new custom headers for storefront API calls. See Issue [#660](https://github.com/Shopify/hydrogen/issues/660)

- [#872](https://github.com/Shopify/hydrogen/pull/872) [`d90bb3be`](https://github.com/Shopify/hydrogen/commit/d90bb3bedcba47e6eee3498145def4ec1644b19c) Thanks [@jplhomer](https://github.com/jplhomer)! - Fix usage of NotFound when it is not possible to modify the `response` object

## 0.12.0

### Minor Changes

- [#809](https://github.com/Shopify/hydrogen/pull/809) [`47f23f9`](https://github.com/Shopify/hydrogen/commit/47f23f921873b782947aed2e54d997ad034801b8) Thanks [@frehner](https://github.com/frehner)! - Upgrade default Storefront API to version '2022-04'. Some components have been updated to use the 2022-04 features and types as well.

  One important change is that the `2022-04` Storefront API no longer encodes object IDs: see more [details here](https://shopify.dev/api/release-notes/2022-04#non-encoded-object-ids-in-the-graphql-storefront-api). Because of this, Hydrogen will no longer decode IDs, either, which will cause issues if you are using a previous version of the Storefront API with Hydrogen components.

* [#780](https://github.com/Shopify/hydrogen/pull/780) [`122a5c5`](https://github.com/Shopify/hydrogen/commit/122a5c5e0b70fa2a11c2c708b303da987f25fc53) Thanks [@jplhomer](https://github.com/jplhomer)! - Adds `queryShop` helper to API routes. This makes it easy to query the Storefront API, similar to how `useShopQuery` is available in server components:

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

- [#712](https://github.com/Shopify/hydrogen/pull/712) [`6368968`](https://github.com/Shopify/hydrogen/commit/6368968e4c68bb44b01b6b0b6903e403269dc233) Thanks [@blittle](https://github.com/blittle)! - Routing in Hydrogen has been updated according to [Custom Routes proposal](https://github.com/Shopify/hydrogen/discussions/569). Specifically, a new `Router` component has been added, and `DefaultRoutes` has been renamed to `FileRoutes`, along with other minor changes. Custom route components are not implemented yet.

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

- [#845](https://github.com/Shopify/hydrogen/pull/858) [`8271be8`](https://github.com/Shopify/hydrogen/commit/8271be83331c99f27a258e6532983da4fe4f0b5b) Thanks [@michenly](https://github.com/michenly)! - Export Seo components Fragement and use them in the starter template.

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
