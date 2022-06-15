# Changelog

## 0.25.0

### Patch Changes

- [#1475](https://github.com/Shopify/hydrogen/pull/1475) [`689aa68f`](https://github.com/Shopify/hydrogen/commit/689aa68ff1b4600e75121e0d88e100f4394c9107) Thanks [@cartogram](https://github.com/cartogram)! - Deprecate create-hydrogen-app in favor of @shopify/create-hydrogen

## 0.24.0

## 0.23.0

### Patch Changes

- [#1462](https://github.com/Shopify/hydrogen/pull/1462) [`effc509c`](https://github.com/Shopify/hydrogen/commit/effc509cbfc9ddf4bf8df9f8dff17daa47362dbb) Thanks [@frehner](https://github.com/frehner)! - Small styling fix to country selector in demo store template

## 0.22.1

## 0.22.0

### Minor Changes

- [#1313](https://github.com/Shopify/hydrogen/pull/1313) [`ed1933e3`](https://github.com/Shopify/hydrogen/commit/ed1933e339927322d8008034982b05ff4590e6d8) Thanks [@frandiox](https://github.com/frandiox)! - **Breaking change**: The `routes` property in `hydrogen.config.js` file has been simplified. It is now a string that represents the path to the routes from the project root:

  ```diff
  // hydrogen.config.js

  export default defineConfig({
  -  routes: import('./src/routes/**/*.server.[jt](s|sx)'),
  +  routes: '/src/routes',
  });
  ```

  Its default value is `/src/routes` so this property can be removed when using this directory.

  In the object syntax version, `dirPrefix` is removed and `files` becomes a string:

  ```diff
  // hydrogen.config.js

  export default defineConfig({
    routes: {
  -   files: import('./src/routes/**/*.server.[jt](s|sx)'),
  -   dirPrefix: './src/routes',
  +   files: '/src/routes',
      basePath: '/',
    },
  });
  ```

* [#930](https://github.com/Shopify/hydrogen/pull/930) [`750baf8f`](https://github.com/Shopify/hydrogen/commit/750baf8ff069d0e06fb92e78a142049a1ce2b1ae) Thanks [@michenly](https://github.com/michenly)! - Add an end-to-end implementation of customer account creation, login, reset password, and logout. The following routes are added:

  1. `/account` - An account settings page for the current logged in user. At the moment mostly unimplemented. If the user accesses the route while not logged in, they will be forwarded to `/account/login`.
  2. `/account/login` - A page for the user to present their credentials and login.
  3. `/account/logout` - An API route that expects a `POST` to delete the current session.
  4. `/account/register` - Contains a form for the user to setup a new account. On success, forwards the user to `/account`
  5. `/account/recover` - A form for the user to fill out to _initiate_ a password reset. If the form succeeds, an email will be sent to the user with a link to reset their password. Clicking the link leads the user to the page `/account/reset/[resetToken]`.
  6. `/account/reset/[id]/[resetToken]` - A form to enter a new password. Submits the new password and `resetToken` to `/account/reset`. On success, forwards the user to `/account`.
  7. `/account/reset` - An API route to update the user with a new password.
  8. `/account/activate/[id]/[activationToken]` - This is a form to activate a new user. The user should only reach this form from a link in their email. Submits the password and `activationToken` to `/account/activate`, On success, forwards the user to `/account`.
  9. `/account/activate` - An API route to activate the user with a password.

  Note: At the moment, the email sent to the user for password resets has the web storefront domain, instead of your Hydrogen domain. This will be resolved, but in the mean time, you can manually replace the domain with your Hydrogen domain to proceed.

  A later release will include a large account admin implementation.

## 0.21.0

## 0.20.0

## 0.19.0

### Minor Changes

- [#1053](https://github.com/Shopify/hydrogen/pull/1053) [`c407f304`](https://github.com/Shopify/hydrogen/commit/c407f304352e0b781fa8a729674153ee9b971977) Thanks [@blittle](https://github.com/blittle)! - The selected country is now persisted a part of the session. This means that the page can be refreshed and the country will still be selected. There are a few breaking changes:

  1. `useCountry()` hook now only returns the currently selected country. The `setCountry()` method has been removed.
  2. The `useCountry()` hook expects a `countryCode` and `countryName` to be a part of the user session.
  3. The example `/countries` API route has been updated to accept a `POST` request to update the selected country. The CountrySelector components need to be updated to use that route.

  ```diff
  // src/routes/countries.server.jsx

  -export async function api(request, {queryShop}) {
  +export async function api(request, {queryShop, session}) {
  +  if (request.method === 'POST') {
  +    const {isoCode, name} = await request.json();
  +
  +    await session.set('countryCode', isoCode);
  +    await session.set('countryName', name);
  +
  +    return 'success';
  +  }

     const {
       data: {
         localization: {availableCountries},
       },
     } = await queryShop({
        query: QUERY,
     });
     return availableCountries.sort((a, b) => a.name.localeCompare(b.name));
  }
  ```

  ```diff
  // src/components/CountrySelector.client.jsx

  export default function CountrySelector() {
    const [listboxOpen, setListboxOpen] = useState(false);

  - const [selectedCountry, setSelectedCountry] = useCountry();
  + const [selectedCountry] = useCountry();

  + const setSelectedCountry = useCallback(
  +   ({isoCode, name}) => {
  +     fetch(`/countries`, {
  +       body: JSON.stringify({isoCode, name}),
  +       method: 'POST',
  +     })
  +       .then(() => {
  +         window.location.reload();
  +       })
  +       .catch((error) => {
  +         console.error(error);
  +       });
  +   },
  +   [],
  + );

    return (
        ...
    );
  }
  ```

  4. Each server component page that depends on the selected country pulls it from the session with `useSession()`, rather than `serverProps`.

  ```diff
  // src/routes/products/[handle].server.jsx
  + import { useSession } from '@shopify/hydrogen';

  - export default function Product({country = {isoCode: 'US'}}) {
  + export default function Product() {
      const {handle} = useRouteParams();
  +   const {countryCode = 'US'} = useSession();
      ...
    }
  ```

## 0.18.0

### Patch Changes

- [#1241](https://github.com/Shopify/hydrogen/pull/1241) [`fe16b48a`](https://github.com/Shopify/hydrogen/commit/fe16b48a580082443425afcf5d4e34990a43fb47) Thanks [@blittle](https://github.com/blittle)! - Fix `dangerouslySetInnerHTML` prop inside the pages route

## 0.17.3

## 0.17.2

## 0.17.1

## 0.17.0

### Minor Changes

- [#1044](https://github.com/Shopify/hydrogen/pull/1044) [`c8f5934d`](https://github.com/Shopify/hydrogen/commit/c8f5934d85db63162a13256cfcf21098b390887b) Thanks [@blittle](https://github.com/blittle)! - Hydrogen now has a built in session and cookie implementation. Read more about [how sessions work in Hydrogen](https://shopify.dev/custom-storefronts/hydrogen/framework/sessions). The starter template also includes a cookie session storage implementation. To use the new session implementation within an existing Hydrogen app:

  ```diff
  import renderHydrogen from '@shopify/hydrogen/entry-server';
  import {
    Router,
    Route,
    FileRoutes,
    ShopifyProvider,
  +  CookieSessionStorage,
  } from '@shopify/hydrogen';
  import {Suspense} from 'react';
  import shopifyConfig from '../shopify.config';
  import DefaultSeo from './components/DefaultSeo.server';
  import NotFound from './components/NotFound.server';
  import LoadingFallback from './components/LoadingFallback';
  import CartProvider from './components/CartProvider.client';

  function App({routes}) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <ShopifyProvider shopifyConfig={shopifyConfig}>
          <CartProvider>
            <DefaultSeo />
            <Router>
              <FileRoutes routes={routes} />
              <Route path="*" page={<NotFound />} />
            </Router>
          </CartProvider>
        </ShopifyProvider>
      </Suspense>
    );
  }

  const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

  export default renderHydrogen(App, {
    routes,
    shopifyConfig,
  +  session: CookieSessionStorage('__session', {
  +    path: '/',
  +    httpOnly: true,
  +    secure: process.env.NODE_ENV === 'production',
  +    sameSite: 'strict',
  +    maxAge: 60 * 60 * 24 * 30,
  +  }),
  });

  ```

* [#1134](https://github.com/Shopify/hydrogen/pull/1134) [`7138bb1d`](https://github.com/Shopify/hydrogen/commit/7138bb1dae884c9e057d1da2ba1f51cd05fff45a) Thanks [@michenly](https://github.com/michenly)! - Upgrade @shopify/cli-hydrogen to v2.0.0

- [#881](https://github.com/Shopify/hydrogen/pull/881) [`a31babfb`](https://github.com/Shopify/hydrogen/commit/a31babfb9bf73b732a18487582cec129acbb8b5e) Thanks [@jplhomer](https://github.com/jplhomer)! - ## Change from serverState to serverProps

  **Breaking changes:**

  1. `useServerState()` is gone. Use `useServerProps()` instead
  2. `useServerProps()` is reset on each page navigation. Previously `useServerState()` was not.
  3. `useServerProps()` does not contain `pathname` and `search`. Use the [useNavigate](https://shopify.dev/api/hydrogen/hooks/framework/usenavigate) hook to programmatically navigate instead.

  **Explanation:**

  The current behavior of server state is to **persist indefinitely** (until a hard page reload). This works great for things like the CountrySelector, where the updated state is meant to persist across navigations. This breaks down for many other use cases. Consider a collection paginator: if you paginate through to the second page of a collection using server state, visit a product page, and then go to a different collection page, the new collection page will use that same pagination variable in server state. This will result in a wonky or errored experience.

  Additionally, we have found that the term for `serverState` is confusing. The hook is used within client components, yet the state is passed as a prop to server components.

  As a result, `serverState` is now gone. Instead communicating between client and server components is through `serverProps`. If a client component wants to re-render server content, it just calls `setServerProps('some', 'data')`. Those props will be serialized to the server, and the server component will re-render. Additionally, the server props are reset on page navigation. So that they will not bleed between pages (fixes #331).

  If you previously relied on `serverState` for global state in your app, you shouldn't use `serverProps` anymore. Instead we'll introduce a new session based mechanism for global state (in the meantime you could manually manage a cookie).

  Lastly, `serverProps` no longer include the `pathname` and `search` parameters. Programmatically navigate in hydrogen instead with the [useNavigate](https://shopify.dev/api/hydrogen/hooks/framework/usenavigate) hook.

### Patch Changes

- [#1124](https://github.com/Shopify/hydrogen/pull/1124) [`737237d2`](https://github.com/Shopify/hydrogen/commit/737237d2229a711b87092c65cbcec8305c1a7460) Thanks [@cartogram](https://github.com/cartogram)! - Changing the casing on the fetchpriority attribute to all lowercase on Gallery images to prevent a React warning.

* [#1125](https://github.com/Shopify/hydrogen/pull/1125) [`552d627b`](https://github.com/Shopify/hydrogen/commit/552d627b5a621c65853d3b6d3825bfe47f7ccff0) Thanks [@cartogram](https://github.com/cartogram)! - Fixed a bug where the price on the product details was not updating when the variant changed.

## 0.16.1

## 0.16.0

### Minor Changes

- [#1094](https://github.com/Shopify/hydrogen/pull/1094) [`10ab341d`](https://github.com/Shopify/hydrogen/commit/10ab341d94a3c4a4913f3cd62b72ab7f9e62409a) Thanks [@jplhomer](https://github.com/jplhomer)! - Update starter template to use new `fetchSync` API

### Patch Changes

- [#929](https://github.com/Shopify/hydrogen/pull/929) [`f9e76eb7`](https://github.com/Shopify/hydrogen/commit/f9e76eb786b69dbbb3e47cfec2528cab82bbe370) Thanks [@cartogram](https://github.com/cartogram)! - Deprecate `@shopify/hydrogen-cli`. Use Shopify CLI (`@shopify/cli-hydrogen` instead.

  The template now adds the `@shopify/cli` dependencies for the `yarn preview` command. To update your existing app:

  To update your existing apps, install the Shopify & Hydrogen CLIs:

  ```bash
  yarn add -D @shopify/cli @shopify/cli-hydrogen
  ```

  And update the `preview` script in your `package.json`:

  ```diff
  -    "preview": "npx @shopify/create-hydrogen-cli@latest preview",
  +    "preview": "shopify hydrogen preview",
  ```

* [#1089](https://github.com/Shopify/hydrogen/pull/1089) [`3c189665`](https://github.com/Shopify/hydrogen/commit/3c18966501633e10dfdcc2eb18c7cc75a8b086d6) Thanks [@cartogram](https://github.com/cartogram)! - Use Shopify CLI to start a local development server instead of `vite`.

  To update your existing apps, install the Shopify & Hydrogen CLIs:

  ```bash
  yarn add -D @shopify/cli @shopify/cli-hydrogen
  ```

  And update the `dev` script in your `package.json`:

  ```diff
  -    "dev": "vite",
  +    "dev": "shopify hydrogen dev",
  ```

## 0.14.0

### Minor Changes

- [#1028](https://github.com/Shopify/hydrogen/pull/1028) [`ba174588`](https://github.com/Shopify/hydrogen/commit/ba174588d8f4a9f1054779a9bf32a92e8d2c921c) Thanks [@michenly](https://github.com/michenly)! - Starting from SF API version `2022-04`, the preferred way to request translatable resources is using the `@inContext` directive. See the [API docs](https://shopify.dev/api/examples/multiple-languages#retrieve-translations-with-the-storefront-api) on how to do this and which resources have translatable properties.

  This causes a breaking change to the `useShopQuery` hook. The `locale` property has been removed from the argument object; `Accept-Language` is no longer being send with every request, and we are no longer using locale as part of the cache key.

  The `useShop` hook will now return the `languageCode` key, which is the first two characters of the existing `locale` key.

  Both `locale` & `languageCode` values are also now capitalized to make it easier to pass into a GraphQL `@inContext` directive.

* [#1020](https://github.com/Shopify/hydrogen/pull/1020) [`e9529bc8`](https://github.com/Shopify/hydrogen/commit/e9529bc81410e0d99f9d3dbdb138ae61d00f876b) Thanks [@jplhomer](https://github.com/jplhomer)! - Preload `Link` URLs by default when a user signals intent to visit the URL. This includes hovering or focusing on the URL. To disable preloading, pass `<Link preload={false} />` to the component.

## 0.13.0

### Minor Changes

- [#912](https://github.com/Shopify/hydrogen/pull/912) [`de0e0d6a`](https://github.com/Shopify/hydrogen/commit/de0e0d6a6652463243ee09013cd30830ce2a246a) Thanks [@blittle](https://github.com/blittle)! - Change the country selector to lazy load available countries. The motivation to do so is that a _lot_ of countries come with the Demo Store template. The problem is 1) the graphql query to fetch them all is relatively slow and 2) all of them get serialized to the browser in each RSC response.

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

  See an example on how this could be done inside the Demo Store template [country selector](https://github.com/Shopify/hydrogen/blob/v1.x-2022-07/templates/demo-store/src/components/CountrySelector.client.jsx)

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

* [#965](https://github.com/Shopify/hydrogen/pull/965) [`cdad13ed`](https://github.com/Shopify/hydrogen/commit/cdad13ed85ff17b84981367f39c7d2fe45e72dcf) Thanks [@blittle](https://github.com/blittle)! - Fix server redirects to work properly with RSC responses. For example, the redirect component within the Demo Store template needs to change:

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

- [#845](https://github.com/Shopify/hydrogen/pull/858) [`8271be8`](https://github.com/Shopify/hydrogen/commit/8271be83331c99f27a258e6532983da4fe4f0b5b) Thanks [@michenly](https://github.com/michenly)! - Export Seo components Fragement and use them in the Demo Store template.

* [#852](https://github.com/Shopify/hydrogen/pull/852) [`6015edf`](https://github.com/Shopify/hydrogen/commit/6015edfa01f7c8e3e7a0120db0847bdc1c068263) Thanks [@frandiox](https://github.com/frandiox)! - Update @headlessui/react version to fix Cart dialog not opening.

## 0.11.0 - 2022-02-24

- feat: update favicon
- feat: HelmetProvider has been removed
- feat: `/src/entry-server.jsx` file has been merged into `App.server.jsx`. The latter is the new default entry point for the server
- feat: `/src/entry-client.jsx` file has been removed. The new entry point in for the client in `index.html` is `/@shopify/hydrogen/entry-client`. Custom entry points are still supported
- fix: Footer date update
- fix: product link errors in Cart.client.jsx of the Demo Store template
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
- fix: Demo Store template media gallery error when handling videos
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

- fix: support Demo Store template homepage without at least three products

## 1.0.0-alpha.23 - 2021-09-22

- fix: reduce NPM package size by skipping `node_modules` etc

## 1.0.0-alpha.22 - 2021-09-22

- No updates. Transitive dependency bump.
