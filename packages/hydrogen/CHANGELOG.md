# Changelog

## 1.7.4

### Patch Changes

- Update dependencies ([#2552](https://github.com/Shopify/hydrogen-v1/pull/2552)) by [@dependabot](https://github.com/apps/dependabot)

- Make sure sub-requests that are 400 or 500 HTTP errors are not cached ([#2554](https://github.com/Shopify/hydrogen-v1/pull/2554)) by [@blittle](https://github.com/blittle)

## 1.7.3

### Patch Changes

- Allow concatenating requests with a header. For example, if you want the route `/shop` to proxy render everything on `/products`, setup an API route at `/routes/shop.server.jsx` with the following: ([#2536](https://github.com/Shopify/hydrogen-v1/pull/2536)) by [@blittle](https://github.com/blittle)

  ```jsx
  export async function api(request) {
    return new Request(new URL(request.url).origin + '/products', {
      headers: {
        'Hydrogen-Concatenate': 'true',
      },
    });
  }
  ```

## 1.7.2

### Patch Changes

- Log extra params in default error logger ([#2533](https://github.com/Shopify/hydrogen-v1/pull/2533)) by [@juanpprieto](https://github.com/juanpprieto)

## 1.7.1

### Patch Changes

- Add support for `languageCode` to the `CartProvider` component ([#2531](https://github.com/Shopify/hydrogen-v1/pull/2531)) by [@blittle](https://github.com/blittle)

## 1.7.0

### Minor Changes

- Updates default `powered-by` header output to `Shopify, Hydrogen`, and updates associateed documentation. ([#2518](https://github.com/Shopify/hydrogen-v1/pull/2518)) by [@benjaminsehl](https://github.com/benjaminsehl)

### Patch Changes

- Fix the `<CartProvider>` to by default pull localization from `<ShopifyProvider>`. You can still override the countryCode by passing a prop directly to `<CartProvider>`. Resolves https://github.com/Shopify/hydrogen/issues/622 ([#2521](https://github.com/Shopify/hydrogen-v1/pull/2521)) by [@blittle](https://github.com/blittle)

- Fix an issue where cache doesn't properly match requests ([#2530](https://github.com/Shopify/hydrogen-v1/pull/2530)) by [@blittle](https://github.com/blittle)

## 1.6.8

### Patch Changes

- Update bot detection list and add support for oxygen-do-not-stream-response header ([#2514](https://github.com/Shopify/hydrogen-v1/pull/2514)) by [@blittle](https://github.com/blittle)

## 1.6.7

### Patch Changes

- Fixed a bug when using <CartLineQuantityAdjustButton /> that caused CartLine Attributes to be erased. CartLine Attributes should now be persisted when using that component. ([#2480](https://github.com/Shopify/hydrogen-v1/pull/2480)) by [@blittle](https://github.com/blittle)

## 1.6.6

### Patch Changes

- Fix race condition and memory leak within Hydrogen Analytics ([#2443](https://github.com/Shopify/hydrogen/pull/2443)) by [@blittle](https://github.com/blittle)

## 1.6.5

### Patch Changes

- Fix issues with cart analytics described in https://github.com/Shopify/hydrogen/issues/2382 ([#2388](https://github.com/Shopify/hydrogen/pull/2388)) by [@lordofthecactus](https://github.com/lordofthecactus)

## 1.6.4

### Patch Changes

- Improve form props type for render function ([#2352](https://github.com/Shopify/hydrogen/pull/2352)) by [@ya-s-u](https://github.com/ya-s-u)

* Fix an issue where non-string server prop values get in-properly parsed. Resolves https://github.com/Shopify/hydrogen/issues/2365 ([#2376](https://github.com/Shopify/hydrogen/pull/2376)) by [@blittle](https://github.com/blittle)

- Fix streaming SSR with multibyte characters ([#2351](https://github.com/Shopify/hydrogen/pull/2351)) by [@ya-s-u](https://github.com/ya-s-u)

* Use correct defaultCartFragment in CartProvider.client.tsx This resolves an error sending Add To Cart events to Shopify Analytics ([#2332](https://github.com/Shopify/hydrogen/pull/2332)) by [@mperreux](https://github.com/mperreux)

## 1.6.3

### Patch Changes

- Updates links to https://shopify.dev/custom-storefronts/hydrogen in favor of a new information architecture. We've split out conceptual material from procedural material and organized the content by area of work. ([#2326](https://github.com/Shopify/hydrogen/pull/2326)) by [@rennyG](https://github.com/rennyG)

## 1.6.2

### Patch Changes

- Add a helper method to get headers to proxy the online store. These headers are necessary to prevent the online store from throttling proxied requests: ([#2300](https://github.com/Shopify/hydrogen/pull/2300)) by [@blittle](https://github.com/blittle)

  ```ts
  import {getOnlineStorefrontHeaders} from '@shopify/hydrogen';

  async function handleEvent(event) {
    const response = fetch(`https://hydrogen.shop/products/hydrogen`, {
      headers: getOnlineStorefrontHeaders(event.request),
    });

    return response;
  }
  ```

* Remove automatic origin support from `fetchSync` on the server. ([#2276](https://github.com/Shopify/hydrogen/pull/2276)) by [@jplhomer](https://github.com/jplhomer)

  **Important: Please test that your Hydrogen app is using `fetchSync` correctly before shipping this version of Hydrogen to production.**

  Developers should never be making `fetch` requests on the server against their own Hydrogen app. This is because some production runtimes prohibit invoking `fetch` requests to servers in the same region. Other runtimes will fail to resolve DNS when invoked from within the same process.

  This change makes it **required** to pass a fully-qualified URL (including origin) to `fetchSync` when it's being used on the server:

  ```jsx
  // MyComponent.server.jsx

  // ❌ You should not use this pattern, and it will now fail:
  fetchSync('/api/path').json();
  ```

  Instead, you should query the data directly, or extract the data query to a function and call it inside your server component:

  ```jsx
  // MyComponent.server.jsx
  import {sharedQuery} from './shared-location.server';

  // ✅ Do this instead:
  useQuery('shared-query', sharedQuery);
  ```

  This is not considered a breaking change because the intention of the server-side `fetchSync` API was never to enable calling a Hydrogen app from itself, but rather to call third-party APIs from the server.

- Fix issue with preload cache which would cause problems when scaled to large amounts of traffic in production. ([#2316](https://github.com/Shopify/hydrogen/pull/2316)) by [@jplhomer](https://github.com/jplhomer)

* Add more UAs to the bot detection list to improve parity with SEO tools ([#2297](https://github.com/Shopify/hydrogen/pull/2297)) by [@davecyen](https://github.com/davecyen)

- Fix RSC responses in some situations where the pathname contains double quotes. ([#2320](https://github.com/Shopify/hydrogen/pull/2320)) by [@frandiox](https://github.com/frandiox)

* Fix unhandled errors when parsing invalid RSC states from URL. ([#2315](https://github.com/Shopify/hydrogen/pull/2315)) by [@frandiox](https://github.com/frandiox)

## 1.6.1

### Hydrogen UI React

We’re excited to announce an experimental version of Hydrogen UI React is now available! We’ve decoupled key components, hooks, and utilities from the Hydrogen framework and moved them into a new package called `@shopify/hydrogen-react`.

You can now bring Hydrogen functionality to your React framework of choice!

The components, hooks, and utilities will continue to be supported in `@shopify/hydrogen` until Hydrogen UI React is made generally available, but all new features will only go into `@shopify/hydrogen-react` going forward.

Check out the [documentation](https://shopify.dev/custom-storefronts/hydrogen/alternate-frameworks) and the [repository](https://github.com/Shopify/hydrogen-ui) to learn more!

### Patch Changes

- Fix RSC response caching ([#2260](https://github.com/Shopify/hydrogen/pull/2260)) by [@wizardlyhel](https://github.com/wizardlyhel)

* Fix the types for `<Seo type="defaultSeo" />` ([#2268](https://github.com/Shopify/hydrogen/pull/2268)) by [@jplhomer](https://github.com/jplhomer)

- Allow `basePath` to be passed to `Route` to support path-based internationalization inside custom route ([#2252](https://github.com/Shopify/hydrogen/pull/2252)) by [@jplhomer](https://github.com/jplhomer)

## 1.6.0

### Minor Changes

- Add Shopify analytics instrumentation for customer events. ([#2238](https://github.com/Shopify/hydrogen/pull/2238)) by [@wizardlyhel](https://github.com/wizardlyhel)

  See the [updated doc](https://shopify.dev/api/hydrogen/components/framework/shopifyanalytics) on `<ShopifyAnalytics />`.

* Updates `CartProvider` to use the new `CartProviderV2`. No code changes are necessary. [Docs for CartProvider can be found here.](https://shopify.dev/api/hydrogen/components/cart/cartprovider) ([#2182](https://github.com/Shopify/hydrogen/pull/2182)) by [@lordofthecactus](https://github.com/lordofthecactus)

  Also adds the following `onComplete` props callbacks:
  | Name | Type | Description |
  | ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | onCreateComplete? | <code>() => void</code> | Invoked when the process to create a cart completes successfully |
  | onLineAddComplete? | <code>() => void</code> | Invoked when the process to add a line item to the cart completes successfully |
  | onLineRemoveComplete? | <code>() => void</code> | Invoked when the process to remove a line item to the cart completes successfully |
  | onLineUpdateComplete? | <code>() => void</code> | Invoked when the process to update a line item in the cart completes successfully |
  | onNoteUpdateComplete? | <code>() => void</code> | Invoked when the process to add or update a note in the cart completes successfully |
  | onBuyerIdentityUpdateComplete? | <code>() => void</code> | Invoked when the process to update the buyer identity completes successfully |
  | onAttributesUpdateComplete? | <code>() => void</code> | Invoked when the process to update the cart attributes completes successfully |
  | onDiscountCodesUpdateComplete? | <code>() => void</code> | Invoked when the process to update the cart discount codes completes successfully |

- Added missing dependancy for faker to hydrogen package ([#2234](https://github.com/Shopify/hydrogen/pull/2234)) by [@Drew-Garratt](https://github.com/Drew-Garratt)

### Patch Changes

- Add more error catches on shopify analytics ([#2256](https://github.com/Shopify/hydrogen/pull/2256)) by [@wizardlyhel](https://github.com/wizardlyhel)

* Requests to SF API will now provide a Custom-Storefront-Group-ID header. ([#2215](https://github.com/Shopify/hydrogen/pull/2215)) by [@uri](https://github.com/uri)

## 1.5.0

### Minor Changes

- Special thank you to @kcarra for adding new mocked Providers for making testing easier! ([#2224](https://github.com/Shopify/hydrogen/pull/2224)) by [@blittle](https://github.com/blittle)

  1. Add `ServerRequestProvider` mock for testing server components:

  ```ts
  import useServerHook from './useServerHook.server'; // Server hook to test
  import {test, vi} from 'vitest';
  import {renderHook} from '@testing-library/react-hooks';
  import {ShopifyProvider} from '@shopify/hydrogen';
  import {MockedServerRequestProvider} from '@shopify/hydrogen/testing';

  describe('useServerHook', () => {
    test('mocked ServerRequest Context', () => {
      const wrapper = ({children}: {children: React.ReactElement}) => (
        <MockedServerRequestProvider>
          <ShopifyProvider shopifyConfig={mockShopifyConfig}>
            {children}
          </ShopifyProvider>
        </MockedServerRequestProvider>
      );
      const {result} = renderHook(() => useServerHook(), {wrapper});
      expect(result.current).toEqual({status: 'active'});
    });
  });
  ```

  2. Add `ShopifyTestProviders` mock for easier testing client components and using client components in other contexts, like Storybook:

  ```ts
  import {ComponentMeta, ComponentStory} from '@storybook/react';
  import React from 'react';
  import BoxCardUI from './BoxCard.ui';
  import {ShopifyTestProviders} from '@shopify/hydrogen/testing';

  export default {
    title: 'Components/BoxCard',
    component: BoxCardUI,
    decorators: [],
  } as ComponentMeta<typeof BoxCardUI>;

  const Template: ComponentStory<typeof BoxCardUI> = (args) => {
    return (
      <ShopifyTestProviders>
        <BoxCardUI {...args} /> // This component imports import{' '}
        {(Image, Link, Money)} from '@shopify/hydrogen'
      </ShopifyTestProviders>
    );
  };

  export const BoxCard = Template.bind({});
  BoxCard.args = mockShopifyProduct;
  ```

* Updated the Storefront API version of Hydrogen to the `2022-10` release. ([#2208](https://github.com/Shopify/hydrogen/pull/2208)) by [@frehner](https://github.com/frehner)

  **This is a backwards-compatible change**; if you are still on the `2022-07` version, you may stay on that version without any issues. However, it is still recommended that you upgrade to `2022-10` as soon as possible.

  For more information about the Storefront API, refer to:

  - The [versioning documentation](https://shopify.dev/api/usage/versioning)
  - The [`2022-10` release notes](https://shopify.dev/api/release-notes/2022-10#graphql-storefont-api-changes). Take note that Hydrogen never used the `Money` fields internally, so the breaking change listed there does not affect Hydrogen.

### Patch Changes

- Experimental version of a new cart provider is ready for beta testing. ([#2219](https://github.com/Shopify/hydrogen/pull/2219)) by [@lordofthecactus](https://github.com/lordofthecactus)

  `CartProviderV2` fixes race conditions with our current cart provider. After beta, `CartProviderV2` will become `CartProvider` requiring no code changes.

  To try this new cart provider:

  ```
  import {CartProviderV2} from '@shopify/hydrogen/experimental';
  ```

## 1.4.4

### Patch Changes

- Prevent unhandled errors when `location.hash` is not a valid element selector for scrolling. ([#2209](https://github.com/Shopify/hydrogen/pull/2209)) by [@potench](https://github.com/potench)

* Changing the content of a CSS Module should now trigger HMR instead of a full page refresh when using `global` CSS mode. ([#2175](https://github.com/Shopify/hydrogen/pull/2175)) by [@frandiox](https://github.com/frandiox)

- Fix imports from `@shopify/hydrogen/experimental` at build time. Previously, importing from this path would end up in unresolved client components. ([#2198](https://github.com/Shopify/hydrogen/pull/2198)) by [@frandiox](https://github.com/frandiox)

## 1.4.3

### Patch Changes

- Critical fix for the CartProvider to remove an error when Cookies are disabled by the browser. ([#2190](https://github.com/Shopify/hydrogen/pull/2190)) by [@blittle](https://github.com/blittle)

## 1.4.2

### Patch Changes

- Fix storefrontId from required to optional param ([#2162](https://github.com/Shopify/hydrogen/pull/2162)) by [@wizardlyhel](https://github.com/wizardlyhel)

* We changed the default logging behavior to include the overall request outcome, either `ok` or an `error`. This is necessary because a streamed request might start with a 200 HTTP response code, and during the process of stream rendering an error is encountered. ([#2161](https://github.com/Shopify/hydrogen/pull/2161)) by [@blittle](https://github.com/blittle)

- Expose CachingStrategy type ([#2159](https://github.com/Shopify/hydrogen/pull/2159)) by [@wizardlyhel](https://github.com/wizardlyhel)

## 1.4.1

### Patch Changes

- Important bug fix for backwards compatibility with old environment variables. Followup from the [change in 1.4.0](https://github.com/Shopify/hydrogen/releases/tag/%40shopify%2Fhydrogen%401.4.0) ([#2151](https://github.com/Shopify/hydrogen/pull/2151)) by [@blittle](https://github.com/blittle)

## 1.4.0

### Minor Changes

- Add the `useDelay` hook for artificial delays when rendering server components. This is useful to debug timing issues or building suspense boundary fallback UI. See the [`useDelay` documentation](https://shopify.dev/api/hydrogen/hooks/global/usedelay). ([#2109](https://github.com/Shopify/hydrogen/pull/2109)) by [@blittle](https://github.com/blittle)

### Patch Changes

- We've exposed the private server-to-server Storefront API token in the Hydrogen config file. This private token is required when deploying to production, otherwise the requests to the storefront API will be rate-limited. This change will make it easier to configure Hydrogen when deploying to non-Oxygen environments. We'll also display a warning in production mode if this token is not defined. ([#1998](https://github.com/Shopify/hydrogen/pull/1998)) by [@blittle](https://github.com/blittle)

  We've also added the `storefrontId` property to the config. This enables Hydrogen data to display properly in the Shopify admin analytics dashboard.

  Lastly, we've updated all Oxygen environment variables to a more consistent naming convention. The previous variables are still available, but are deprecated, and will be removed in the future. You’ll see a warning in your console if you use the old environment variables. You can update your variable references using this table:

  | **Old Oxygen variable**             | **New Oxygen variable**      |
  | ----------------------------------- | ---------------------------- |
  | SHOPIFY_STORE_DOMAIN                | PUBLIC_STORE_DOMAIN          |
  | SHOPIFY_STOREFRONT_API_PUBLIC_TOKEN | PUBLIC_STOREFRONT_API_TOKEN  |
  | SHOPIFY_STOREFRONT_API_SECRET_TOKEN | PRIVATE_STOREFRONT_API_TOKEN |
  | SHOPIFY_STOREFRONT_ID               | PUBLIC_STOREFRONT_ID         |

* Fixed dev-mode Hydrogen builds to properly show `PUBLIC_` prefixed environment variables ([#2142](https://github.com/Shopify/hydrogen/pull/2142)) by [@blittle](https://github.com/blittle)

- An issue with previewing hydrogen in production has been fixed. Make sure that you upgrade both `@shopify/cli` and `@shopify/cli-hydrogen` to 3.12.0. ([#2144](https://github.com/Shopify/hydrogen/pull/2144)) by [@blittle](https://github.com/blittle)

## 1.3.2

### Patch Changes

- Whenever using `fetchSync`, make sure to handle the error state. Though we've made changes to the error thrown by the JSON parser to also tell you that the request was unsuccessful: ([#2070](https://github.com/Shopify/hydrogen/pull/2070)) by [@blittle](https://github.com/blittle)

  ```ts
  function MyComponent() {
    const response = fetchSync('/api');

    // Make sure the error state is handled!
    if (!response.ok) {
      console.error(
        `Unable to load ${response.url} returned ${response.status}`,
      );
      return <div>Error. Please try again</div>;
    }

    // Check `response.ok` before parsing the response
    const json = response.json();

    return ...
  ```

* Update undici to the latest ([#2015](https://github.com/Shopify/hydrogen/pull/2015)) by [@dependabot](https://github.com/apps/dependabot)

- Added experimental support for Vite 3. By default, Hydrogen will still use Vite 2. However, it is possible to upgrade apps to Vite 3 by changing `devDependencies` in the app `package.json`. Beware that this is experimental and it might break. ([#1992](https://github.com/Shopify/hydrogen/pull/1992)) by [@frandiox](https://github.com/frandiox)

* Hydrogen responses now contain a `Link` header to preload stylesheets. ([#2075](https://github.com/Shopify/hydrogen/pull/2075)) by [@frandiox](https://github.com/frandiox)

- Improvements and fixes to hydrogen logging: ([#2084](https://github.com/Shopify/hydrogen/pull/2084)) by [@blittle](https://github.com/blittle)

  1. API Routes are now passed a reference to the logger bound to the current request:

  ```ts
  export async function api(request, {log}) {
    log.warn("Here's a warning!");
    return new Request('Hello World');
  }
  ```

  2. If you define a custom logging implementation within your Hydrogen config, we'll now warn you when your logging implementation itself errors.

* When a route is rendering, if Hydrogen has already started streaming, it is invalid to call `response.doNotStream()`. Disabling streaming should always happen before any async operation in your route server component. This change fixes Hydrogen to warn if you try to disable streaming after the stream has already begun. ([#2081](https://github.com/Shopify/hydrogen/pull/2081)) by [@frandiox](https://github.com/frandiox)

## 1.3.1

### Patch Changes

- `<ExternalVideo/>` now has a default prop of `loading="lazy"` to improve performance of the rendered `<iframe>`. ([#2044](https://github.com/Shopify/hydrogen/pull/2044)) by [@frehner](https://github.com/frehner)

  If you're using `<ExternalVideo/>` above the fold, then we recommend setting this prop to `eager`.

* Improve error handling: ([#2049](https://github.com/Shopify/hydrogen/pull/2049)) by [@blittle](https://github.com/blittle)

  1. Improve how errors are default presented in the logs.
  1. Make sure that when useShopQuery fails, that an Error object is propagated.

  If you have implemented your own logging handler, it is recommended that you only print strings, as printing objects (including Error objects) will result in unhelpful logs in many runtimes (Oxygen included):

  ```js
  // Example custom logging for errors
  export default defineConfig({
    logger: {
      error: (context, error) => {
        const url = context ? ` ${context.url}` : '';

        if (error instanceof Error) {
          // Do NOT directly just print the error, instead
          // print the error.messag or error.stack
          console.error(`Error:${url}\n${error.stack}`);
        } else {
          console.error(`Error:${url} ${error}`);
        }
      },
    },
  });
  ```

## 1.3.0

### Minor Changes

- Add the experimental `useFlashSession` hook. This hook reads and clears a session value. It is useful for request validation within the experimental `<Form>` component: ([#1878](https://github.com/Shopify/hydrogen/pull/1878)) by [@blittle](https://github.com/blittle)

  ```ts
  import {Form, useFlashSession} from '@shopify/hydrogen/experimental';

  export default function Login() {
    const loginError = useFlashSession('loginError');

    return (
      <Form action="/login">
        {loginError ? <div>Invalid user!</div> : null}
        <input type="text" name="username" />
        <input type="password" name="password" />
        <button type="submit">Login</button>
      </Form>
    );
  }

  export async function api(request, {session}) {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    const userId = await getUser(username, password);

    if (!userId) {
      await session.set('loginError', 'INVALID_USER');
      return new Request('/login');
    } else {
      await session.set('userId', userId);
      return new Request('/account');
    }
  }
  ```

  Note, `useFlashSession` is experimental, and subject to change at any time.

### Patch Changes

- Pass root to all Vite instances to support building projects from different directories. ([#1987](https://github.com/Shopify/hydrogen/pull/1987)) by [@frandiox](https://github.com/frandiox)

* Added a new option `assetHashVersion` to the Hydrogen plugin in `vite.config.js`. This option can be used to manually change the assets file hash. ([#2000](https://github.com/Shopify/hydrogen/pull/2000)) by [@frandiox](https://github.com/frandiox)

  ```js
  // vite.config.js
  export default {
    plugins: [hydrogen({assetHashVersion: 'v2'})],
  };
  ```

- Fix accessing `Oxygen.env` in `hydrogen.config.js` file in production. ([#1977](https://github.com/Shopify/hydrogen/pull/1977)) by [@frandiox](https://github.com/frandiox)

* Add null check for `runtime.waitUntil` ([#1958](https://github.com/Shopify/hydrogen/pull/1958)) by [@ascorbic](https://github.com/ascorbic)

- `<Image/>` now sets the attribute `decoding='async'` by default, to potentially improve performance. ([#1969](https://github.com/Shopify/hydrogen/pull/1969)) by [@sanjaiyan-dev](https://github.com/sanjaiyan-dev)

* Fix stale while revalidate when custom cache value is supplied ([#1967](https://github.com/Shopify/hydrogen/pull/1967)) by [@wizardlyhel](https://github.com/wizardlyhel)

- The Typescript types for the `<Image/>` component are now available to import directly from Hydrogen. ([#1913](https://github.com/Shopify/hydrogen/pull/1913)) by [@frehner](https://github.com/frehner)

  ```ts
  import {
    type ShopifyImageProps,
    type ExternalImageProps,
  } from '@shopify/hydrogen';
  ```

* Change how the RSC plugin communicates with other plugins to support `vanilla-extract`. ([#1944](https://github.com/Shopify/hydrogen/pull/1944)) by [@frandiox](https://github.com/frandiox)

- Adds `merchandise.product.id` to cart line items query ([#1988](https://github.com/Shopify/hydrogen/pull/1988)) by [@juanpprieto](https://github.com/juanpprieto)

* Fix \_\_rsc requests to have a cache-control header ([#2010](https://github.com/Shopify/hydrogen/pull/2010)) by [@blittle](https://github.com/blittle)

- Adds `prevCart` to cart event payloads ([#1982](https://github.com/Shopify/hydrogen/pull/1982)) by [@juanpprieto](https://github.com/juanpprieto)

## 1.2.0

### Minor Changes

- Add a new experimental Forms and mutations feature. Read more https://shopify.dev/custom-storefronts/hydrogen/forms ([#1552](https://github.com/Shopify/hydrogen/pull/1552)) by [@blittle](https://github.com/blittle)

* `CartLineQuantityAdjustButton`, `BuyNowButton`, and `AddToCartButton` now have an `as` property. The types for these components have also been improved. ([#1827](https://github.com/Shopify/hydrogen/pull/1827)) by [@blittle](https://github.com/blittle)

- Added a new experimental CSS approach to support importing styles directly in React Server Components. This feature must be enabled manually. ([#1843](https://github.com/Shopify/hydrogen/pull/1843)) by [@frandiox](https://github.com/frandiox)

  Until now, we had experimental support for CSS Modules with some minor restrictions and drawbacks:

  - Only server components that were the default export had access to the CSS Module automatically (i.e. it required extra work for named exports).
  - CSS Module was duplicated when used in multiple components.
  - RSC responses had all the CSS inlined, making them much larger.

  The new CSS approach adds full support for CSS Modules without the previous restrictions and drawbacks.

  Aside from that, it also adds support for pure CSS and enables a way to integrate with tools that provide CSS-in-JS at build time. All the CSS imported in both client and server components will be extracted in a CSS file at build time and downloaded with a `<link rel="stylesheet">` tag. During development, styles will be inlined in the DOM to better support HMR.

  To activate this new experimental feature, pass the `experimental.css: 'global'` option to Hydrogen's Vite plugin:

  ```js
  // vite.config.js
  export default {
    plugins: [hydrogen({experimental: {css: 'global'}})],
  };
  ```

  Examples:

  ```jsx
  // App.server.jsx using pure CSS with global classes
  import './my-red-style.css';

  function App() {
    return <div className="red">...</div>;
  }
  ```

  ```jsx
  // App.server.jsx using CSS Modules with scoped classes
  import {red} from './my-red.module.css';

  function App() {
    return <div className={red}>...</div>;
  }
  ```

* `loadScript` and `useLoadScript` can now inject in the <head /> ([#1870](https://github.com/Shopify/hydrogen/pull/1870)) by [@juanpprieto](https://github.com/juanpprieto)

- Add support for custom 500 error pages. If an unexpected error occurs while rendering a route, Hydrogen will respond with a 500 HTTP error and render a default error page. Define a custom error page with the `serverErrorPage` configuration property: ([#1867](https://github.com/Shopify/hydrogen/pull/1867)) by [@blittle](https://github.com/blittle)

  ```tsx
  import {defineConfig} from '@shopify/hydrogen/config';

  export default defineConfig({
    ...
    serverErrorPage: '/src/Error.jsx',
  });
  ```

  The `serverErrorPage` property defaults to `/src/Error.{jsx,tsx}`. The custom error page is passed an `Error` property:

  ```tsx
  export default function Error({error}) {
    return (
      <div>
        <h1>An unknown error occured!</h1>
        <h2>{error.message}</h2>
        <h3>{error.stack}</h3>
      </div>
    );
  }
  ```

### Patch Changes

- Log detailed error message for Storefront API root errors ([#1822](https://github.com/Shopify/hydrogen/pull/1822)) by [@wizardlyhel](https://github.com/wizardlyhel)

* `locale` calculation logic and docs have been updated to support Shopify languages with extended language subtags. ([#1836](https://github.com/Shopify/hydrogen/pull/1836)) by [@lordofthecactus](https://github.com/lordofthecactus)

  The following is how we calculate `locale`:
  If the Shopify `language` includes a region, then this value is used to calculate the `locale` and `countryCode` is disregarded. For example, if `language` is `PT_BR` (Brazilian Portuguese), then `locale` is calculated as `PT-BR`.
  If the Shopify `language` doesn't include a region, then this value is merged with the `countryCode` to calculate the `locale`. For example, if `language` is `EN` (English) and `countryCode` is `US` (United States), then `locale` is calculated as `EN-US`.

- Added optional sellingPlanId prop to AddToCartButton.client.tsx ([#1821](https://github.com/Shopify/hydrogen/pull/1821)) by [@ChrisKG32](https://github.com/ChrisKG32)

* Fix: Hydrogen no longer caches error responses. Any 400 or 500 level response will not have a cache control-header, nor will Hydrogen cache it internally. ([#1873](https://github.com/Shopify/hydrogen/pull/1873)) by [@blittle](https://github.com/blittle)

- Allow `sourceProps` to be passed to `<Video/>`'s underlying `<source>` elements. ([#1847](https://github.com/Shopify/hydrogen/pull/1847)) by [@frehner](https://github.com/frehner)

### Special Thanks

- Thanks to [@mrkldshv](https://github.com/mrkldshv) for help in migrating tests from Jest to Vitest.
- Thanks to [@davidhousedev](https://github.com/davidhousedev) for constant feedback and discussions.

## 1.1.0

### Migration for Stores based on the "Demo Store" template

If your Store is based on the "Demo Store" tempate, and you are using the `test:ci` NPM script, then you need to replace the contents of your `/tests/utils.js` or `/tests/utils.ts` file with the following:

- For Typescript projects, replace `/tests/utils.ts` with the content found [here](https://github.com/Shopify/hydrogen/blob/e2a14cb3eb0f8f171603c597dfe572df4d11cc7a/templates/demo-store/tests/utils.ts)
- For Javascript projects, replace `/tests/utils.js` with the content found [here](https://gist.github.com/frehner/2b2ba6639d5cc13c39f5eeea707413c4)

### Minor Changes

- Replace graphiql with graphql/graphql-playground in local development at '/graphql` route. ([#1710](https://github.com/Shopify/hydrogen/pull/1710)) by [@cartogram](https://github.com/cartogram)

* Expose utilities for integrating Hydrogen with 3rd party platforms in `@shopify/hydrogen/platforms`. These utilities can resolve the project build path automatically and also find the client build assets. ([#1772](https://github.com/Shopify/hydrogen/pull/1772)) by [@frandiox](https://github.com/frandiox)

  ```js
  import {
    handleRequest, // Instead of './src/App.server'
    indexTemplate, // Instead of './dist/client/index.html?raw'
    isAsset, // Access a list of files in './dist/client/**/*'
  } from '@shopify/hydrogen/platforms';

  // Platform entry handler
  export default function (request) {
    if (isAsset(new URL(request.url).pathname)) {
      return platformAssetHandler(request);
    }

    return handleRequest(request, {indexTemplate});
  }
  ```

  Note that user apps don't need to be changed.

### Patch Changes

- Fix server props to properly reset on page navigation. Fixes https://github.com/Shopify/hydrogen/issues/1817 ([#1830](https://github.com/Shopify/hydrogen/pull/1830)) by [@blittle](https://github.com/blittle)

* Serve assets in `public` directory from the same origin when deploying to Oxygen. ([#1815](https://github.com/Shopify/hydrogen/pull/1815)) by [@frandiox](https://github.com/frandiox)

  Normally, public assets are served from a CDN domain that is different from the storefront URL. This creates issues in some situations where the assets need to be served from the same origin, such as when using service workers in PWA or tools like Partytown. This change adds a proxy so that the browser can download assets from the same origin.

  Note that, for performance reasons, it is still recommended placing assets in `/src/assets` instead of `/public` whenever possible.

- The payload returned by `fetchSync` was supposed to mimic `react-fetch` but it wrongly moved the Response data to a sub-property `response`. This has been fixed to have the Response at the top level. Also, cached responses are now correctly serialized and retrieved to avoid issues on cache hit. ([#1760](https://github.com/Shopify/hydrogen/pull/1760)) by [@frandiox](https://github.com/frandiox)

  ```diff
  const response = fetchSync('...');
  -response.response.headers.get('...');
  +response.headers.get('...');
  const jsonData = response.json();
  ```

  Note that the sub-property `response` is still available but marked as deprecated.

* Improve error messaging when there is an error in the Storefront API's GraphQL response. ([#1837](https://github.com/Shopify/hydrogen/pull/1837)) by [@frehner](https://github.com/frehner)

- `null` shopId fix on the `PerformanceMetrics` component ([#1722](https://github.com/Shopify/hydrogen/pull/1722)) by [@wizardlyhel](https://github.com/wizardlyhel)

* Make sure full page caching only caches on GET request ([#1839](https://github.com/Shopify/hydrogen/pull/1839)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Fix server props when using non UTF-8 characters in URL. ([#1780](https://github.com/Shopify/hydrogen/pull/1780)) by [@frandiox](https://github.com/frandiox)

* Fix HMR in client components. It should now update only the modified client component in the browser instead of refreshing the entire page. ([#1818](https://github.com/Shopify/hydrogen/pull/1818)) by [@frandiox](https://github.com/frandiox)

## 1.0.2

### Patch Changes

- `<Image/>` component has improved handling for `width` as a string. It also corrects an issue with the `scale` prop and its usage with the Shopify CDN. The generated `srcset` is also updated and improved. ([#1723](https://github.com/Shopify/hydrogen/pull/1723)) by [@frehner](https://github.com/frehner)

* We've decided to deprecate the `<LocalizationProvider>`, and instead put all its functionality into `<ShopifyProvider>`. The justification is that both providers are required by many components and hooks, and we think it's easier to have a single required `<ShopifyProvider>` instead of two. The same props available to the `<LocalizationProvider>` are now available on the `<ShopifyProvider>`. ([#1735](https://github.com/Shopify/hydrogen/pull/1735)) by [@blittle](https://github.com/blittle)

  ```diff
  // App.server.tsx
  function App({routes, request}: HydrogenRouteProps) {
    ...
    return (
      <Suspense fallback={<HeaderFallback isHome={isHome} />}>
  +     <ShopifyProvider countryCode={countryCode as CountryCode}>
  -     <ShopifyProvider>
  -     <LocalizationProvider countryCode={countryCode as CountryCode}>
          <CartProvider countryCode={countryCode as CountryCode}>
              ...
          </CartProvider>
          <PerformanceMetrics />
          {import.meta.env.DEV && <PerformanceMetricsDebug />}
          <ShopifyAnalytics />
  -     </LocalizationProvider>
        </ShopifyProvider>
      </Suspense>
    );
  }
  ```

  Note: this is not a breaking change. `<LocalizationProvider>` will still be available, but all documentation will now point to `<ShopifyProvider>`.

- Remove `formData` polyfill in worker environments. ([#1740](https://github.com/Shopify/hydrogen/pull/1740)) by [@frandiox](https://github.com/frandiox)

* Fix `useProductOptions` export to avoid errors at build time. ([#1738](https://github.com/Shopify/hydrogen/pull/1738)) by [@frandiox](https://github.com/frandiox)

## 1.0.1

### Patch Changes

- [#1716](https://github.com/Shopify/hydrogen/pull/1716) [`4e6356e6`](https://github.com/Shopify/hydrogen/commit/4e6356e67bf92ff621573eac36fe34f37a1c326c) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Fix add to cart Shopify session tracking

* [#1713](https://github.com/Shopify/hydrogen/pull/1713) [`ea47ab68`](https://github.com/Shopify/hydrogen/commit/ea47ab68b112c0c1c5b28020c8a2fa91a54f0b78) Thanks [@frandiox](https://github.com/frandiox)! - Fix `fetchSync` when called with relative URLs.

## 1.0.0

### Major Changes

- [#1700](https://github.com/Shopify/hydrogen/pull/1700) [`9b6c564e`](https://github.com/Shopify/hydrogen/commit/9b6c564eb20ca75d9995e3eed581339960e222c1) Thanks [@jplhomer](https://github.com/jplhomer)! - Hydrogen is now out of developer preview. Thank you for all of your feedback and contributions the past eight months!

## 0.27.0

### Minor Changes

- [#1697](https://github.com/Shopify/hydrogen/pull/1697) [`85aab092`](https://github.com/Shopify/hydrogen/commit/85aab092b2f47d77bb917659918a011783cd8c34) Thanks [@blittle](https://github.com/blittle)! - Remove `defaultLocale` from the Hydrogen Config and instead add `defaultCountryCode` and `defaultLanguageCode`. Both of which are also now available by the `useShop()` hook:

  ```diff
  export default defineConfig({
    shopify: {
  -    defaultLocale: 'EN-US',
  +    defaultCountryCode: 'US',
  +    defaultLanguageCode: 'EN',
      storeDomain: 'hydrogen-preview.myshopify.com',
      storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
      storefrontApiVersion: '2022-07',
    },
  }
  ```

* [#1662](https://github.com/Shopify/hydrogen/pull/1662) [`4262b319`](https://github.com/Shopify/hydrogen/commit/4262b3196afb96415d3b0f8f874f351030e6a734) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Fix server analytics route

  - Fix ServerAnalyticsRoute so that it does complete all async work
  - Move Performance and Shopify analytic reporting to client side
  - Make sure `ShopifyAnalytics` make its own query for shop id and currency
  - Remove query for shop id and currency from `DefaultSeo` component
  - Make Performance and Shopify server analytics connector do nothing

  ### Deprecated components

  Remove the following components from `hydrogen.config.js`

  - `PerformanceMetricsServerAnalyticsConnector`
  - `ShopifyServerAnalyticsConnector`

## 0.26.1

### Patch Changes

- [#1663](https://github.com/Shopify/hydrogen/pull/1663) [`66200d6b`](https://github.com/Shopify/hydrogen/commit/66200d6b7d8e54b0746a048e950f067d4b8e0609) Thanks [@jplhomer](https://github.com/jplhomer)! - Default to 'US' CountryCode if locale cannot be parsed correctly

* [#1690](https://github.com/Shopify/hydrogen/pull/1690) [`afde8989`](https://github.com/Shopify/hydrogen/commit/afde8989ae03e842de65ac698ab86033e56e7ee2) Thanks [@frehner](https://github.com/frehner)! - Add scale to the filename part of the url in `shopifyImageLoader()`

- [#1676](https://github.com/Shopify/hydrogen/pull/1676) [`0149cbf6`](https://github.com/Shopify/hydrogen/commit/0149cbf60b331461ae0c97bb3e18d3f27e143d0a) Thanks [@frandiox](https://github.com/frandiox)! - Avoid writing to Node response if it has been closed early.

* [#1674](https://github.com/Shopify/hydrogen/pull/1674) [`8068d3ce`](https://github.com/Shopify/hydrogen/commit/8068d3ce14f44ea83bde8f3729ae2a8cbbf8a52e) Thanks [@frandiox](https://github.com/frandiox)! - Throw error when `<Link>` component is used outside of `<Router>` component.

- [#1680](https://github.com/Shopify/hydrogen/pull/1680) [`acf5223f`](https://github.com/Shopify/hydrogen/commit/acf5223fe34cfdd483ae9b0e714445c8cbf11a9d) Thanks [@blittle](https://github.com/blittle)! - Fix basepath to not apply to external URLs in the `<Link` component. Also default the attribute `rel="noreferrer noopener` for external URLs.

* [#1670](https://github.com/Shopify/hydrogen/pull/1670) [`8b26f7a6`](https://github.com/Shopify/hydrogen/commit/8b26f7a6f034eaa36bb11974ff3dc5d992e2e97b) Thanks [@frandiox](https://github.com/frandiox)! - Optimize client boundaries only during build by default.

## 0.26.0

### Minor Changes

- [#1615](https://github.com/Shopify/hydrogen/pull/1615) [`20bfc438`](https://github.com/Shopify/hydrogen/commit/20bfc4388ed400dc215a41cca44fe8cd4a11022a) Thanks [@frehner](https://github.com/frehner)! - `<CartEstimatedCost/>` has been renamed to `<CartCost/>` to match a recent update to the Storefront API, in which `cart.estimatedCost` is being deprecated in favor of `cart.cost`.

  Additionally, `cart.cost.compareAtAmount` was renamed to `cart.cost.compareAtAmountPerQuantity`.

* [#1619](https://github.com/Shopify/hydrogen/pull/1619) [`b0c13696`](https://github.com/Shopify/hydrogen/commit/b0c13696b6030ab8697147fdbe3ccdf2522a3913) Thanks [@blittle](https://github.com/blittle)! - We have reworked how localization works in Hydrogen. By default the `useLocalization()` hook returns the default locale defined within your [Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/configuration). The `<LocalizationProvider>` component now takes `countryCode` and `languageCode` as optional props. Any props given to `<LocalizationProvider>` will also be used by the `useLocalization` hook.

  **Breaking Change**

  The `useCountry` hook has been removed. Instead use the [`useLocalization` hook](https://shopify.dev/api/hydrogen/hooks/localization/uselocalization).

  ```diff
  - import {useCountry, gql} from '@shopify/hydrogen';
  + import {useLocalization, gql} from '@shopify/hydrogen';

  export function MyComponent() {

  -  const [country] = useCountry();
  +  const {country} = useLocalization();

    return ( /* Your JSX */ );
  }
  ```

  The `Link` component now respects the `basePath` property defined within it's parent `FileRoutes` component. For example, given `<FileRoutes basePath="/cn">`, a route within that renders `<Link to="/products">` will actually produce an anchor tag prefixed with `/cn`: `<a href="/cn/products">`. You can override the `basePath` with a `basePath` prop on the `Link` component.

- [#1646](https://github.com/Shopify/hydrogen/pull/1646) [`1103fb57`](https://github.com/Shopify/hydrogen/commit/1103fb575e51d5948c6bd4885bcd911be1f8bf7e) Thanks [@benjaminsehl](https://github.com/benjaminsehl)! - Updates default SEO titleTemplate for the Homepage

### Patch Changes

- [#1569](https://github.com/Shopify/hydrogen/pull/1569) [`e5896a3e`](https://github.com/Shopify/hydrogen/commit/e5896a3e20b0bf2760b238e713a7bc04f7e95e2d) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Clean up full page cache work with `waitUntil`

* [#1643](https://github.com/Shopify/hydrogen/pull/1643) [`3b849606`](https://github.com/Shopify/hydrogen/commit/3b849606c4999d19920330f86c535a6f892dcc65) Thanks [@frandiox](https://github.com/frandiox)! - Do not cache client components in browser when using TypeScript.

- [#1605](https://github.com/Shopify/hydrogen/pull/1605) [`2eb2c461`](https://github.com/Shopify/hydrogen/commit/2eb2c4615210cafadab8ed154909f3516c72db3e) Thanks [@frandiox](https://github.com/frandiox)! - Fix hydration issues with `useId`.

* [#1613](https://github.com/Shopify/hydrogen/pull/1613) [`c45ebd3c`](https://github.com/Shopify/hydrogen/commit/c45ebd3cf468c9f596ef399712506bd766dea54d) Thanks [@frehner](https://github.com/frehner)! - The `<ShopPayButton/>` and `<CartShopPayButton/>` now take in a `width` prop to help customize how wide the `<shop-pay-button>` custom element is, by using the newly added CSS custom property (variable) `--shop-pay-button-width`.

- [#1651](https://github.com/Shopify/hydrogen/pull/1651) [`a19be2b2`](https://github.com/Shopify/hydrogen/commit/a19be2b22cee63bf95ade3a4f5803c460651a473) Thanks [@blittle](https://github.com/blittle)! - Fixes to the cart:

  1. Fix bug when providing a lower-case country code to the `LocalizationProvider`
  2. Make sure that the Cart always logs API errors

* [#1649](https://github.com/Shopify/hydrogen/pull/1649) [`df0e01ff`](https://github.com/Shopify/hydrogen/commit/df0e01fff6afae22a30be8c0bb750aed016326a4) Thanks [@blittle](https://github.com/blittle)! - Add a `x-powered-by: Shopify-Hydrogen` header which can be disabled with the Hydrogen config property: `poweredByHeader: false`

- [#1566](https://github.com/Shopify/hydrogen/pull/1566) [`cfe7385e`](https://github.com/Shopify/hydrogen/commit/cfe7385e0c64c3dc465d1bcd34ad9c7040db9969) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Add storefont id to cart provider query

* [#1551](https://github.com/Shopify/hydrogen/pull/1551) [`3d20e92d`](https://github.com/Shopify/hydrogen/commit/3d20e92db3402e356c16d0bc5fc4450f9d8c0df5) Thanks [@jplhomer](https://github.com/jplhomer)! - In-Memory caching is now enabled by default in production for Node.js runtimes.

- [#1604](https://github.com/Shopify/hydrogen/pull/1604) [`f3827d31`](https://github.com/Shopify/hydrogen/commit/f3827d31263352689c5149a5509b51d1fdb572d4) Thanks [@cartogram](https://github.com/cartogram)! - Adds new `load-config` entry point that exposes a `loadConfig()` function that will return the configuration object and the path to the found configuration file for a given Hydrogen project root.

  Example:

  ```ts
  import {loadConfig} from '@shopify/hydrogen/load-config';

  const {configuration, configurationPath} = await loadConfig({
    root: 'path/to/hydrogen-app',
  });
  ```

* [#1626](https://github.com/Shopify/hydrogen/pull/1626) [`29218452`](https://github.com/Shopify/hydrogen/commit/29218452a1679be629616993d8cc23ad7077667b) Thanks [@frandiox](https://github.com/frandiox)! - Fix import aliases.

- [#1622](https://github.com/Shopify/hydrogen/pull/1622) [`d339239d`](https://github.com/Shopify/hydrogen/commit/d339239d23b074cba3ee637166f8120512a6afee) Thanks [@frandiox](https://github.com/frandiox)! - Fix module resolution after HMR in some scenarios.

* [#1608](https://github.com/Shopify/hydrogen/pull/1608) [`b834dfdc`](https://github.com/Shopify/hydrogen/commit/b834dfdcddc56c78bb6fbb7e0a681cc3c977b62d) Thanks [@jplhomer](https://github.com/jplhomer)! - Add type exports for `HydrogenRouteProps`, `HydrogenApiRoute`, and `HydrogenApiRouteOptions`.

- [#1603](https://github.com/Shopify/hydrogen/pull/1603) [`e1bb5810`](https://github.com/Shopify/hydrogen/commit/e1bb5810f218acc5b7debb60bcdebc6c9594f86c) Thanks [@frandiox](https://github.com/frandiox)! - Do not trigger prefetch when `to` prop is missing in the `Link` component.

## 0.25.1

## 0.25.0

### Minor Changes

- [#1570](https://github.com/Shopify/hydrogen/pull/1570) [`36f26e54`](https://github.com/Shopify/hydrogen/commit/36f26e54a0b136fe4b21807756969e592934c9f2) Thanks [@frehner](https://github.com/frehner)! - `<Image/>` now takes into account a specific order for determining the width and height.

  1. `loaderOptions`'s width/height
  2. width/height bare props
  3. `data`'s width/height

  `getShopifyImageDimensions()` was also updated to handle this logic.

* [#1506](https://github.com/Shopify/hydrogen/pull/1506) [`58d6ef55`](https://github.com/Shopify/hydrogen/commit/58d6ef55be2929c9a1680a6a372bb2e5fdfb7ee6) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Hydrogen now supports full-page caching out of the box. Previously, Hydrogen relied on the network edge to provide full-page caching for dynamic responses (HTML).

- [#1346](https://github.com/Shopify/hydrogen/pull/1346) [`01814369`](https://github.com/Shopify/hydrogen/commit/018143693f96b7a200258665de570a9369ae8e65) Thanks [@lordofthecactus](https://github.com/lordofthecactus)! - Add `onClick` and `buttonRef` props to `AddToCartButton`, `BuyNowButton` and `CartLineQuantityAdjustButton`

* [#1523](https://github.com/Shopify/hydrogen/pull/1523) [`4ef2e5b9`](https://github.com/Shopify/hydrogen/commit/4ef2e5b93cd537a213334211113c224194d9dd68) Thanks [@blittle](https://github.com/blittle)! - We've simplified the built-in Hydrogen caching strategies. Instead of `CacheSeconds`, `CacheMinutes`, `CacheHours`, `CacheDays`, `CacheMonths`, and `NoStore`, there is no simply `CacheLong`, `CacheShort`, and `CacheNone`. Please remember that you can [build your own caching strategies](https://shopify.dev/custom-storefronts/hydrogen/querying/manage-caching#create-a-caching-strategy).

- [#1513](https://github.com/Shopify/hydrogen/pull/1513) [`8d67b559`](https://github.com/Shopify/hydrogen/commit/8d67b559e8d59d02ca353ec43fb5b2b3ff2f5961) Thanks [@frandiox](https://github.com/frandiox)! - **Breaking change:** We are starting to use [`exports` property in `package.json`](https://nodejs.org/api/packages.html#package-entry-points) to list all the entry points in this package.

  This might incur breaking changes in some rare cases when importing private properties from Hydrogen `dist` files. Notice that we **discourage** doing so for anything that is not publicly documented but, if your app was relying on some private properties, then this might help:

  ```diff
  -import {xyz} from '@shopify/hydrogen/dist/esnext/<internal-path>';
  +import {xyz} from '@shopify/hydrogen/<internal-path>';
  ```

  Aside from that, it is recommended that TypeScript projects update the `tsconfig.json` file to use `compilerOptions.moduleResolution: "node16"` to make sure Hydrogen types are loaded in your editor.
  For JavaScript projects, create or edit `<root>/jsconfig.json` file with the following information to improve typings:

  ```json
  {
    "compilerOptions": {
      "target": "es2020",
      "module": "esnext",
      "moduleResolution": "node16",
      "lib": ["dom", "dom.iterable", "scripthost", "es2020"],
      "jsx": "react",
      "types": ["vite/client"]
    },
    "exclude": ["node_modules", "dist"],
    "include": ["**/*.js", "**/*.jsx"]
  }
  ```

* [#1528](https://github.com/Shopify/hydrogen/pull/1528) [`72d21b87`](https://github.com/Shopify/hydrogen/commit/72d21b87e48a682794889610741f03560bce0be7) Thanks [@frehner](https://github.com/frehner)! - Metafields have changed in Storefront API `2022-07`. We updated our code to work with that update, which means that the following changes will **only work if you're using `2022-07` or newer.**

  ## Metafields changes

  ### Storefront API `2022-07`

  Metafields have changed how you access them in the Storefront API. See [the release notes](https://shopify.dev/api/release-notes/2022-07) for more details. In order to support the new way of querying metafields, Hydrogen has made the following updates:

  ### `<Metafield/>`

  Previously, the `<Metafield/>` component expected you to use `useParseMetafields()` before passing a metafield to it.

  Now, `<Metafield/>` will use `parseMetafield()` itself so that you don't have to. However, this does mean that if you use `parseMetafield()` and then pass it to `<Metafield/>`, it will likely break because it will try to parse your metafield's value a second time.

  ### `useParsedMetafields()` and `parseMetafield()`

  Deprecated `useParsedMetafields()` in favor of `parseMetafield()`. `parseMetafield()` takes in a single metafield and returns a new object, and importantly it can be used on both the client _and_ the server.

  If you need to memoize the value on the client, then you can do so using `React.memo`:

  ```tsx
  import {useMemo} from 'react';
  import {parseMetafield} from '@shopify/hydrogen'x

  function MyComponent() {
    const parsedMetafield = useMemo(() => parseMetafield(metafield), [metafield]);
  }
  ```

- [#1517](https://github.com/Shopify/hydrogen/pull/1517) [`68b8185e`](https://github.com/Shopify/hydrogen/commit/68b8185e74805a6453e246f01ce69a38988078ef) Thanks [@frandiox](https://github.com/frandiox)! - **Breaking change:** The utilities used in `hydrogen.config.js` file are now exported from `@shopiy/hydrogen/config` instead of `@shopify/hydrogen`:

  ```diff
  -import {defineConfig} from '@shopify/hydrogen/config';
  import {
  + defineConfig,
    CookieSessionStorage,
    PerformanceMetricsServerAnalyticsConnector,
    ShopifyServerAnalyticsConnector,
  -} from '@shopify/hydrogen';
  +} from '@shopify/hydrogen/config'

  export default defineConfig({
    shopify: {/* ... */},
    session: CookieSessionStorage('__session', {
      path: '/',
      /* ... */
    }),
    serverAnalyticsConnectors: [
      PerformanceMetricsServerAnalyticsConnector,
      ShopifyServerAnalyticsConnector,
    ],
  });
  ```

### Patch Changes

- [#1494](https://github.com/Shopify/hydrogen/pull/1494) [`3b549439`](https://github.com/Shopify/hydrogen/commit/3b549439bae1ec43ae9171744c576c53d8e8f6f1) Thanks [@jplhomer](https://github.com/jplhomer)! - Update `flattenConnection` to accept `nodes` and `edges` payloads

* [#1579](https://github.com/Shopify/hydrogen/pull/1579) [`2f75247c`](https://github.com/Shopify/hydrogen/commit/2f75247c071253ae27f6070a066897b5758a6a4f) Thanks [@frandiox](https://github.com/frandiox)! - Support renaming client component exports in intermediate/facade files.

- [#1562](https://github.com/Shopify/hydrogen/pull/1562) [`d38f6413`](https://github.com/Shopify/hydrogen/commit/d38f6413361d1ecb49c52d8389547d2b064081f7) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Add storefront id to useShopQuery calls when available

* [#1593](https://github.com/Shopify/hydrogen/pull/1593) [`ae35b70b`](https://github.com/Shopify/hydrogen/commit/ae35b70b0847e1a6270d1c63d2968a3578442e66) Thanks [@juanpprieto](https://github.com/juanpprieto)! - Ensure the effect that updates the `cart.buyerIdenity.countryCode` is run when `countyCode` prop changes

- [#1504](https://github.com/Shopify/hydrogen/pull/1504) [`cc453242`](https://github.com/Shopify/hydrogen/commit/cc4532426509fd216f1bc036d5a095a18812b0cb) Thanks [@jplhomer](https://github.com/jplhomer)! - Fix read-only request.status in worker environments.

* [#1548](https://github.com/Shopify/hydrogen/pull/1548) [`923cb140`](https://github.com/Shopify/hydrogen/commit/923cb140b44fe989388f8754a8ca88bbfc68ab71) Thanks [@cartogram](https://github.com/cartogram)! - Add new devTools interface for performance, settings and graphQL tracking

- [#1375](https://github.com/Shopify/hydrogen/pull/1375) [`217b5f23`](https://github.com/Shopify/hydrogen/commit/217b5f23613da794bb6879ab0c897b66ef6204cf) Thanks [@blittle](https://github.com/blittle)! - Add a built-in healthcheck route available at `/__health`. It responds with a 200 and no body. Also suppresses server logs for built-in routes like healthcheck and analytics.

* [#1541](https://github.com/Shopify/hydrogen/pull/1541) [`4fde81f9`](https://github.com/Shopify/hydrogen/commit/4fde81f9d9ee739a6fbe5a8a903d3e6901144bf0) Thanks [@frandiox](https://github.com/frandiox)! - Fix support for latest React@experimental version.

- [#1497](https://github.com/Shopify/hydrogen/pull/1497) [`3364225f`](https://github.com/Shopify/hydrogen/commit/3364225ff62d283893643ea28c0135ff22af1dff) Thanks [@blittle](https://github.com/blittle)! - Improve waterfall detection

  1. Show a summary in dev mode with instructions on getting details
  2. Only show the waterfall warning the second time the page is loaded
  3. Don't show the waterfall warning on preloaded queries

* [#1519](https://github.com/Shopify/hydrogen/pull/1519) [`d54b1072`](https://github.com/Shopify/hydrogen/commit/d54b10725b635f4531e94b9391cfd56f31a1d2e5) Thanks [@frandiox](https://github.com/frandiox)! - Improve CPU performance of the `useMoney` hook.

- [#1518](https://github.com/Shopify/hydrogen/pull/1518) [`f0b69477`](https://github.com/Shopify/hydrogen/commit/f0b6947762acdfd617c9ccd34615a36a64ab36f2) Thanks [@frandiox](https://github.com/frandiox)! - Compile code to latest supported ES version in workers and Node.

* [#1571](https://github.com/Shopify/hydrogen/pull/1571) [`accdc78a`](https://github.com/Shopify/hydrogen/commit/accdc78a13cc1557826509545a322bfa04e6e288) Thanks [@jplhomer](https://github.com/jplhomer)! - Upgrade Hydrogen to React v18.2. To update your app, run `yarn add @shopify/hydrogen@latest react@latest react-dom@latest`.

- [#1578](https://github.com/Shopify/hydrogen/pull/1578) [`f5290393`](https://github.com/Shopify/hydrogen/commit/f5290393264c523045cab4082495e81ec72d576d) Thanks [@frandiox](https://github.com/frandiox)! - Fix an issue where newly imported client components were not found in the browser.

* [#1556](https://github.com/Shopify/hydrogen/pull/1556) [`06f3d174`](https://github.com/Shopify/hydrogen/commit/06f3d174ff286ece0a7175ac7c2ae37e574f73b0) Thanks [@blittle](https://github.com/blittle)! - Add support for `Request.formData()` within API Routes for Node 16-17. Example:

  ```ts
  export async function api(request) {
    const formData = await request.formData();

    const username = formData.get('user');
    const password = formData.get('pass');

    ...
  }
  ```

## 0.24.0

### Minor Changes

- [#1489](https://github.com/Shopify/hydrogen/pull/1489) [`e2ee2d45`](https://github.com/Shopify/hydrogen/commit/e2ee2d4575613ae34727de9c1a6280904bb2e3ff) Thanks [@blittle](https://github.com/blittle)! - In an effort to be performant by default, the [preloaded queries](https://shopify.dev/custom-storefronts/hydrogen/querying/preloaded-queries) are turned on by default when caching is also enabled. By default, each query has caching enabled too, so `preload` will on universally by default.

* [#1237](https://github.com/Shopify/hydrogen/pull/1237) [`356e75f3`](https://github.com/Shopify/hydrogen/commit/356e75f351c04ff393e996c34632005331ec0872) Thanks [@frehner](https://github.com/frehner)! - Updated Cart queries in two ways, one of which requires you to be using Storefront API `2022-07`:

  1. [`CartLine`](https://shopify.dev/api/storefront/2022-04/objects/CartLine#fields) now uses [`CartLineEstimatedCost`'s `totalAmount`](https://shopify.dev/api/storefront/2022-04/objects/CartLineEstimatedCost) field for calculating the Line's total, instead of doing it manually.
  2. Cart now uses [`totalQuantity`](https://shopify.dev/api/storefront/2022-07/objects/Cart#field-cart-totalquantity) for calculating how many items are in the cart, instead of doing this manually. **Note that this feature is only available in Storefront API `2022-07` and newer.**

### Patch Changes

- [#1473](https://github.com/Shopify/hydrogen/pull/1473) [`a7f3b4bf`](https://github.com/Shopify/hydrogen/commit/a7f3b4bfe0d66fb0440dff3d641a181372de313a) Thanks [@frandiox](https://github.com/frandiox)! - Reduce CPU consumption when rendering React Server Components.

* [#1453](https://github.com/Shopify/hydrogen/pull/1453) [`84b9e6d3`](https://github.com/Shopify/hydrogen/commit/84b9e6d3516a74f94fab691d6ff7605623351f1e) Thanks [@jplhomer](https://github.com/jplhomer)! - Update `setSelectedVariant` types to allow `null` to be passed.

- [#1484](https://github.com/Shopify/hydrogen/pull/1484) [`990bfd8b`](https://github.com/Shopify/hydrogen/commit/990bfd8b928425f2685901c1a02b686354d18d4d) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Fix ClientAnalytics losing subscriber object when passed as a param

* [#1509](https://github.com/Shopify/hydrogen/pull/1509) [`05081b01`](https://github.com/Shopify/hydrogen/commit/05081b01283c023e9c751c04ed496003daf47091) Thanks [@jplhomer](https://github.com/jplhomer)! - Fix `<BuyNowButton>` so it can be rendered without being nested in a `<CartProvider>`

- [#1469](https://github.com/Shopify/hydrogen/pull/1469) [`07d45290`](https://github.com/Shopify/hydrogen/commit/07d452905492bfa1bd58c681b8d56407fdc4716b) Thanks [@frandiox](https://github.com/frandiox)! - Fix path resolution when using aliases in server components.

* [#1471](https://github.com/Shopify/hydrogen/pull/1471) [`5b4e08df`](https://github.com/Shopify/hydrogen/commit/5b4e08df97dd2343452b0d1f7ff59ac5bbf98d32) Thanks [@frandiox](https://github.com/frandiox)! - Added an experimental hook `useRequestContext` that provides server-only context for third party integrations.

- [#1486](https://github.com/Shopify/hydrogen/pull/1486) [`a31e007d`](https://github.com/Shopify/hydrogen/commit/a31e007dbc2a1a6ce12e39ffc3f63f45e90abfa7) Thanks [@frehner](https://github.com/frehner)! - Fix `<ProductOptionsProvider/>`'s `setSelectedOptions()` function to update the `selectedVariant` as well

## 0.23.0

### Minor Changes

- [#1389](https://github.com/Shopify/hydrogen/pull/1389) [`9a21108f`](https://github.com/Shopify/hydrogen/commit/9a21108f6ff89474db9ff8bec26733fcbe744bdc) Thanks [@blittle](https://github.com/blittle)! - **Breaking change**

  The utility `isClient` has been renamed to `isBrowser`. This is because the utility really checks if the running context is a browser, _not_ if the context is a client component.

  All client components by default also run on the server when they are server rendered. If you don't want that to happen, use the `isBrowser()` hook. Remember that anything not server rendered will be unavailable for SEO bots.

* [#1431](https://github.com/Shopify/hydrogen/pull/1431) [`6975bdb9`](https://github.com/Shopify/hydrogen/commit/6975bdb90cfdc03562d21cec09150c52ff31ff78) Thanks [@jplhomer](https://github.com/jplhomer)! - Add `scroll` prop to `Link` and `navigate` to allow the scroll restoration behavior to be disabled.

  By default, when a `<Link>` component is clicked, Hydrogen emulates default browser behavior and attempts to restore the scroll position previously used in the visitor's session. For new pages, this defaults to scrolling to the top of the page.

  However, if you are building a user interface that should fetch a new server components request and update the URL but not modify scroll position, then you can disable scroll restoration using the `scroll` prop:

  ```jsx
  import {Link} from '@shopify/hydrogen';
  export default function Index({request}) {
    const url = new URL(request.normalizedUrl);

    return (
      <>
        <p>Current param is: {url.searchParams.get('param')}</p>
        <Link to="/?param=foo" scroll={false}>
          Update param to foo
        </Link>
      </>
    );
  }
  ```

- [#1325](https://github.com/Shopify/hydrogen/pull/1325) [`572c18d1`](https://github.com/Shopify/hydrogen/commit/572c18d1893b212cfc3f1be3043a67dcca251629) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - - Fix clientAnalytics not waiting for all server analytics data before sending page view event

  - Fix server analytics connector erroring out after more than 1 server analytics connectors are attached
  - Shopify analytics components

  #### Updates to server analytics connectors

  The server analytics connector interface has updated to

  ```jsx
  export function request(
    requestUrl: string,
    requestHeader: Headers,
    data?: any,
    contentType?: string
  ): void {
    // Do something with the analytic event.
  }
  ```

  #### Introducing Shopify analytics

  Optional analytics components that allows you to send ecommerce related analytics to
  Shopify. Adding the Shopify analytics components will allow the Shopify admin - Analytics
  dashboard to work.

  For information, see [Shopify Analytics](https://shopify.dev/api/hydrogen/components/framework/shopifyanalytics)

* [#1334](https://github.com/Shopify/hydrogen/pull/1334) [`58e039d4`](https://github.com/Shopify/hydrogen/commit/58e039d45cf69b670628f9f7ea62cb7c2d8425d9) Thanks [@blittle](https://github.com/blittle)! - With the introduction of authenticated pages, we also now provide the ability to prevent pages from being indexed by bots. You can do so by passing `noindex` to the `Seo` component:

  ```jsx
  <Seo type="noindex" data={{title: 'Login'}} />
  ```

- [#1397](https://github.com/Shopify/hydrogen/pull/1397) [`fbd185ab`](https://github.com/Shopify/hydrogen/commit/fbd185ab47e7335992b7844af0ef0b0aea6d70a5) Thanks [@frehner](https://github.com/frehner)! - ## `<ProductProvider/>` and `<ProductOptionsProvider/>`

  - `<ProductProvider/>` has been removed
    - `<ProductPrice/>` was the only component left that used it; now it requires a `data` prop that takes in the product object
  - `<ProductOptionsProvider/>` now maintains and provides the state that `useProductOptions` used to keep track of by itself. This change enables you to use multiple `useProductOptions` hook calls and have them share the same state (such as selected variant, options, etc.)

* [#1403](https://github.com/Shopify/hydrogen/pull/1403) [`979f8177`](https://github.com/Shopify/hydrogen/commit/979f81775a4bfa83276030da07cb012e6cb08e2f) Thanks [@frandiox](https://github.com/frandiox)! - **Breaking change**: The `setLogger` and `setLoggerOptions` utilities have been removed. The same information can now be passed under the `logger` property in Hydrogen config:

  ```diff
  // App.server.jsx

  -import {setLogger, setLoggerOptions} from '@shopify/hydrogen';

  -setLogger({
  -  trace() {},
  -  error() {},
  -  // ...
  -});

  -setLoggerOptions({
  -  showQueryTiming: true,
  -  showCacheControlHeader: true,
  -  // ...
  -});

  function App() {
    // ...
  }

  export default renderHydrogen(App);
  ```

  ```diff
  // hydrogen.config.js

  export default defineConfig({
    // ...
  + logger: {
  +   trace() {},
  +   error() {},
  +   showQueryTiming: true,
  +   showCacheControlHeader: true,
  +   // ...
  + },
  });
  ```

- [#1433](https://github.com/Shopify/hydrogen/pull/1433) [`cd354d3a`](https://github.com/Shopify/hydrogen/commit/cd354d3a6205b5a8ef14426040121ac620c8c158) Thanks [@frandiox](https://github.com/frandiox)! - The `response.writeHead` method has been removed, while `response.status` and `response.statusText` are now writable.

  ```diff
  function App({response}) {
  - response.writeHead({
  -   headers: {'custom-header': 'value'},
  -   status: 404,
  - });
  + response.headers.set('custom-header', 'value');
  + response.status = 404;
  }
  ```

* [#1418](https://github.com/Shopify/hydrogen/pull/1418) [`512cb009`](https://github.com/Shopify/hydrogen/commit/512cb009fadeb1907fafa2cef8b568081799335f) Thanks [@frandiox](https://github.com/frandiox)! - **Breaking change**: The client configuration, including the `strictMode` option, has been moved from custom client entry handlers to the Hydrogen configuration file. If you had a custom client entry file just to pass client options, you can remove it and do the same in `hydrogen.config.js`:

  ```diff
  // Custom client entry handler

  -renderHydrogen(ClientWrapper, {strictMode: false});
  +renderHydrogen(ClientWrapper);
  ```

  ```diff
  // hydrogen.config.jsx

  export default defineConfig({
  +  strictMode: false,
  });
  ```

  To remove a custom client entry handler in case it's not needed anymore, delete the custom file and change `index.html`:

  ```diff
  <body>
    <div id="root"></div>
  - <script type="module" src="/src/custom-client-entry"></script>
  + <script type="module" src="/@shopify/hydrogen/entry-client"></script>
  </body>
  ```

- [#1401](https://github.com/Shopify/hydrogen/pull/1401) [`335b70ce`](https://github.com/Shopify/hydrogen/commit/335b70ce67f9f137875fcd18f32e00c1b1b4c533) Thanks [@frandiox](https://github.com/frandiox)! - **Breaking change**: The `enableStreaming` config option has been deprecated. The same feature can be done directly in the app:

  ```diff
  // hydrogen.config.js

  export default defineConfig({
    shopify: {
      // ...
    },
  - enableStreaming: (req) => {
  -   return req.headers.get('user-agent') !== 'custom bot';
  - },
  });
  ```

  ```diff
  // App.server.jsx

  -function App() {
  +function App({request, response}) {
  + if (request.headers.get('user-agent') === 'custom bot') {
  +   response.doNotStream();
  + }

    return <Suspense fallback={'Loading...'}>{/*...*/}</Suspense>;
  }

  export default renderHydrogen(App);
  ```

### Patch Changes

- [#1425](https://github.com/Shopify/hydrogen/pull/1425) [`e213aa86`](https://github.com/Shopify/hydrogen/commit/e213aa8656b17bf649fef714befa99b9618aae45) Thanks [@frandiox](https://github.com/frandiox)! - Rename internal Hydrogen global variables that could conflict with third party libraries that use the same names.

* [#1361](https://github.com/Shopify/hydrogen/pull/1361) [`cf2ef664`](https://github.com/Shopify/hydrogen/commit/cf2ef664cd1e91bc53fc34698ac23797c398e74f) Thanks [@frandiox](https://github.com/frandiox)! - Improve component bundling to reduce the total amount of JS files downloaded in the browser.

- [#1452](https://github.com/Shopify/hydrogen/pull/1452) [`ed1586a7`](https://github.com/Shopify/hydrogen/commit/ed1586a758fd36bddcc422a75db8a7971ce946d5) Thanks [@frandiox](https://github.com/frandiox)! - Reduce CPU consumption when rendering React Server Components.

* [#1399](https://github.com/Shopify/hydrogen/pull/1399) [`583ce40c`](https://github.com/Shopify/hydrogen/commit/583ce40c97391bb22e6e15e736e6237e9a1ea085) Thanks [@frandiox](https://github.com/frandiox)! - Confusing warnings that are not actionable have been removed.

- [#1460](https://github.com/Shopify/hydrogen/pull/1460) [`18056879`](https://github.com/Shopify/hydrogen/commit/18056879f1ea1dc54f146184bfdd4f01f24df636) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Fix doc links

* [#1444](https://github.com/Shopify/hydrogen/pull/1444) [`0b4ee487`](https://github.com/Shopify/hydrogen/commit/0b4ee4876998923f206f6d28b1a3ef95c9616e59) Thanks [@blittle](https://github.com/blittle)! - Propagate a better error message when the response from the storefront API is not JSON parseable

- [#1227](https://github.com/Shopify/hydrogen/pull/1227) [`8eae0a07`](https://github.com/Shopify/hydrogen/commit/8eae0a07ab02e61ac8742e42488825090ca0aa37) Thanks [@jplhomer](https://github.com/jplhomer)! - Enable streaming by default for all platforms

* [#1427](https://github.com/Shopify/hydrogen/pull/1427) [`7115d7d8`](https://github.com/Shopify/hydrogen/commit/7115d7d8dc291b7e5b4dda200baf8a906a005cc8) Thanks [@jplhomer](https://github.com/jplhomer)! - Properly support Node v18

- [#1424](https://github.com/Shopify/hydrogen/pull/1424) [`446c12bf`](https://github.com/Shopify/hydrogen/commit/446c12bffa08eadccfd27afe8b5f34c77a61d134) Thanks [@frandiox](https://github.com/frandiox)! - Custom loggers can return promises from their methods. Hydrogen will await for them after the current request is over but before the runtime instance ends.

* [#1423](https://github.com/Shopify/hydrogen/pull/1423) [`aaf9efa4`](https://github.com/Shopify/hydrogen/commit/aaf9efa45dc9453e95be8e3020c259368ac5f4d0) Thanks [@frandiox](https://github.com/frandiox)! - Workers context (e.g. `waitUntil`) is now scoped to the current request instead of globally available.

- [#1330](https://github.com/Shopify/hydrogen/pull/1330) [`c7dc6440`](https://github.com/Shopify/hydrogen/commit/c7dc644059206e7080c33d9f7e0096c168ae593e) Thanks [@ejfranco06](https://github.com/ejfranco06)! - [#1245] - Generate a default srcset for an image returned by the Shopify CDN on the Image component and allow using a custom set of `widths.`

## 0.22.1

### Patch Changes

- [#1394](https://github.com/Shopify/hydrogen/pull/1394) [`3a681ac2`](https://github.com/Shopify/hydrogen/commit/3a681ac289cc7850f79bc080a445bc6c0b6926fb) Thanks [@jplhomer](https://github.com/jplhomer)! - Make graphql-tag a dependency instead of a devDependency

## 0.22.0

### Minor Changes

- [#930](https://github.com/Shopify/hydrogen/pull/930) [`750baf8f`](https://github.com/Shopify/hydrogen/commit/750baf8ff069d0e06fb92e78a142049a1ce2b1ae) Thanks [@michenly](https://github.com/michenly)! - With the introduction of authenticated pages, we also now provide the ability to prevent pages from being indexed by bots. You can do so by passing `noindex` to the `Seo` component:

  ```jsx
  <Seo type="noindex" data={{title: 'Login'}} />
  ```

* [#1313](https://github.com/Shopify/hydrogen/pull/1313) [`ed1933e3`](https://github.com/Shopify/hydrogen/commit/ed1933e339927322d8008034982b05ff4590e6d8) Thanks [@frandiox](https://github.com/frandiox)! - **Breaking change**: The `routes` property in `hydrogen.config.js` file has been simplified. It is now a string that represents the path to the routes from the project root:

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

- [#1332](https://github.com/Shopify/hydrogen/pull/1332) [`5ec1bc62`](https://github.com/Shopify/hydrogen/commit/5ec1bc62cf9e4348aa389d4154f8c80dccfb96bb) Thanks [@frandiox](https://github.com/frandiox)! - A new `gql` utility is exported from `@shopify/hydrogen` that replaces `graphql-tag` dependency when using `useShopQuery`. It helps reducing bundle size in production when compared to the original `graphql-tag`.

  Before:

  ```js
  import gql from 'graphql-tag';

  // ...

  useShopQuery({
    query: gql`...`,
    // ...
  });
  ```

  After:

  ```js
  import {gql} from '@shopify/hydrogen';

  // ...

  useShopQuery({
    query: gql`...`,
    // ...
  });
  ```

* [#1340](https://github.com/Shopify/hydrogen/pull/1340) [`631832ec`](https://github.com/Shopify/hydrogen/commit/631832ecaef26b918e774515ada6b80668ec5e4e) Thanks [@jplhomer](https://github.com/jplhomer)! - **Breaking change**: The `response.send()` function has been removed. Use `export async function api()` to send custom responses instead.

### Patch Changes

- [#1371](https://github.com/Shopify/hydrogen/pull/1371) [`84a2fd09`](https://github.com/Shopify/hydrogen/commit/84a2fd09b7150b1d5e1f92b786f4a6af09e18739) Thanks [@frehner](https://github.com/frehner)! - Made updates to `<Image/>`:

  - Fixed some TypeScript type issues with Image.
  - `data.url` and `alt` are now required props in Typescript, but won't break the actual component if you don't pass them.

* [#1348](https://github.com/Shopify/hydrogen/pull/1348) [`211093e5`](https://github.com/Shopify/hydrogen/commit/211093e5f1a9e2ad115eb667746bfa2c6dd05b82) Thanks [@developit](https://github.com/developit)! - Fix HTML double-decoding in flight response

- [#1345](https://github.com/Shopify/hydrogen/pull/1345) [`331ff3c0`](https://github.com/Shopify/hydrogen/commit/331ff3c0f58143df3e7c542116f9a94838710352) Thanks [@frandiox](https://github.com/frandiox)! - Reduce the amount of user app files downloaded in the browser.

* [#1322](https://github.com/Shopify/hydrogen/pull/1322) [`36bd77c4`](https://github.com/Shopify/hydrogen/commit/36bd77c4619ec071ea11b764bb16b5670b0afa6b) Thanks [@frandiox](https://github.com/frandiox)! - Fix server hanging in Node.js environment when not using Hydrogen Middleware.

- [#1360](https://github.com/Shopify/hydrogen/pull/1360) [`d9b0d03b`](https://github.com/Shopify/hydrogen/commit/d9b0d03b64d2207b314d15fc0acf6a5143610b92) Thanks [@blittle](https://github.com/blittle)! - Fix a problem where encoded html content props passed from server to client components would get double decoded, and break hydration on app load.

* [#1355](https://github.com/Shopify/hydrogen/pull/1355) [`c45a45e8`](https://github.com/Shopify/hydrogen/commit/c45a45e895b8407da04c6b4608e7f16170452c24) Thanks [@jplhomer](https://github.com/jplhomer)! - Ensure all Hydrogen components are exported properly

- [#1339](https://github.com/Shopify/hydrogen/pull/1339) [`fef4cb84`](https://github.com/Shopify/hydrogen/commit/fef4cb8496d985d37b6113865ac1252f78058aaa) Thanks [@jplhomer](https://github.com/jplhomer)! - Use `import.meta.env.DEV` instead of `process.env.LOCAL_DEV` to hash asset filenames and show performance metrics debugging

* [#1320](https://github.com/Shopify/hydrogen/pull/1320) [`7e9df897`](https://github.com/Shopify/hydrogen/commit/7e9df897465012cd0cf374a1a35deb2ca8a16fc3) Thanks [@jplhomer](https://github.com/jplhomer)! - Properly log errors during flight responses

- [#1363](https://github.com/Shopify/hydrogen/pull/1363) [`0941d3be`](https://github.com/Shopify/hydrogen/commit/0941d3be12b52edc045b898864435f591fc2c42e) Thanks [@frandiox](https://github.com/frandiox)! - Remove some server utilities from client build.

## 0.21.0

### Minor Changes

- [#1327](https://github.com/Shopify/hydrogen/pull/1327) [`ce56311f`](https://github.com/Shopify/hydrogen/commit/ce56311fc1b63df22f77b199980439548f76997a) Thanks [@frehner](https://github.com/frehner)! - **Breaking Change**: `<Money />` updates and `<UnitPrice />` Removed.

  - `<UnitPrice/>` has been removed
  - `<Money/>` has two new props: `measurement` and `measurementSeparator` which do the work that `UnitPrice` used to do
  - The TypeScript types for `<Money/>` have been improved and should provide a better typed experience now

* [#1216](https://github.com/Shopify/hydrogen/pull/1216) [`771786a6`](https://github.com/Shopify/hydrogen/commit/771786a6475c4caadb1abe5f6644e2b5c2abc021) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Fixes an issue where cached sub-requests were not revalidating properly.

- [#1304](https://github.com/Shopify/hydrogen/pull/1304) [`aa196150`](https://github.com/Shopify/hydrogen/commit/aa19615024de4fe16d548429665a863e9aae0248) Thanks [@frehner](https://github.com/frehner)! - Removed `<ProductTitle/>` and `<ProductDescription/>` components. To migrate, use `{product.title}` and `{product.description}` instead.

* [#1335](https://github.com/Shopify/hydrogen/pull/1335) [`0d90f92b`](https://github.com/Shopify/hydrogen/commit/0d90f92b448b0c4d99be3e5f5fa25d0b70a8315e) Thanks [@blittle](https://github.com/blittle)! - **Breaking Change**

  The `<ProductMetafield />` component has been removed. Instead, directly use the `<Metafield>` component.

### Patch Changes

- [#1311](https://github.com/Shopify/hydrogen/pull/1311) [`3e3fd72f`](https://github.com/Shopify/hydrogen/commit/3e3fd72f7016c0993deceefc121306cf957ef564) Thanks [@jplhomer](https://github.com/jplhomer)! - Client components no longer need to use `@shopify/hydrogen/client` as the import path. All Hydrogen components can now be imported from `@shopify/hydrogen` regardless of their context.

* [#1259](https://github.com/Shopify/hydrogen/pull/1259) [`110e9aca`](https://github.com/Shopify/hydrogen/commit/110e9aca385d553e3a87fea406f8bd8a43a0788f) Thanks [@blittle](https://github.com/blittle)! - You can now easily disable streaming on any page conditionally with the `enableStreaming` option inside `hydrogen.config.js`:

  ```ts
  import {CookieSessionStorage} from '@shopify/hydrogen';
  import {defineConfig} from '@shopify/hydrogen/config';

  export default defineConfig({
    routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
    shopify: {
      defaultLocale: 'en-us',
      storeDomain: 'hydrogen-preview.myshopify.com',
      storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
      storefrontApiVersion: '2022-07',
    },
    enableStreaming: (req) => req.headers.get('user-agent') !== 'custom bot',
  });
  ```

  By default all pages are stream rendered except for SEO bots. There shouldn't be many reasons to disable streaming, unless there is a custom bot not covered by Hydrogen's bot detection.

- [#1318](https://github.com/Shopify/hydrogen/pull/1318) [`668a24da`](https://github.com/Shopify/hydrogen/commit/668a24daebf180747a002c8020c2e712f5d9a458) Thanks [@blittle](https://github.com/blittle)! - Buffer RSC flight responses. There isn't any benefit to streaming them, because we start a transition on page navigation. Buffering also fixes caching problems on the flight response.

* [#1293](https://github.com/Shopify/hydrogen/pull/1293) [`e378ed61`](https://github.com/Shopify/hydrogen/commit/e378ed6199553f64d9e73ad27f9409ef501aa724) Thanks [@jplhomer](https://github.com/jplhomer)! - Reverts [#1272](https://github.com/Shopify/hydrogen/pull/1272) and properly escapes terminating script sequences

- [#1283](https://github.com/Shopify/hydrogen/pull/1283) [`eea82cb0`](https://github.com/Shopify/hydrogen/commit/eea82cb02064471d274e534c557caa5d3527bc93) Thanks [@jplhomer](https://github.com/jplhomer)! - Hydrogen has been updated to use the latest stable version of React.

  To update an existing Hydrogen app:

  ```bash
  yarn add react@latest react-dom@latest
  ```

## 0.20.0

### Minor Changes

- [#1257](https://github.com/Shopify/hydrogen/pull/1257) [`5cd7a672`](https://github.com/Shopify/hydrogen/commit/5cd7a6727befe1e06f35b9ec68d4c81a8858d46f) Thanks [@frandiox](https://github.com/frandiox)! - Support for CSS Modules has been improved. It now behaves closer to the default behavior in Vite where styles are collected automatically.

  Remove the `StyleTag` component that was needed before:

  ```diff
  export default function MyComponent() {
    return (
      <div>
  -      <myStyles.StyleTag />
        <h1>Title</h1>
      </div>
    );
  }
  ```

  Optionally, update your wildcard imports to default or named imports:

  ```diff
  -import * as myStyles from './my.module.css';
  +import myStyles from './my.module.css';
  // Or
  +import {red, green, blue} from './my.module.css';
  ```

* [#1271](https://github.com/Shopify/hydrogen/pull/1271) [`9d0359b8`](https://github.com/Shopify/hydrogen/commit/9d0359b87b0cfa04f12ffa9376e5b8ad72c560a3) Thanks [@frehner](https://github.com/frehner)! - ## `<Image/>`

  The `<Image/>` component and related utility functions were reworked and the following changes apply:

  - `useImageUrl` is no longer available; use `shopifyImageLoader` instead, which is available to run both server- and client-side.
  - The TypeScript experience with `<Image/>` is improved; props will be validated better, and `loader` and `loaderOptions` will be better typed
  - When using the `src` prop, `width` and `height` are now required
  - When using the `data` prop, `data.width` and `data.height` or `width` and `height` props are required
  - The `src` and `data` props are mutually exclusive
  - The `loader` prop now receives a singular param as an object
  - `options` has been merged with `loaderOptions`. When using the `data` prop, `loaderOptions` will be the options for Shopify CDN images. When using the `src` prop, `loaderOptions` will be whatever you define them to be.
  - The TypeScript type `ImageSizeOptions` is now named `ShopifyLoaderOptions`
  - The TypeScript type `ImageLoaderOptions` is now named `ShopifyLoaderParams`
  - The `priority` prop was removed; use the HTML-standard `loading` prop instead

  ## `<Video/>`

  - The `<Video/>` component's `options` props was renamed to `imagePreviewOptions` to add clarity as to what the options were for.
  - `imagePreviewOptions` matches the (newly updated) shape of `<Image/>`'s `loaderOptions`

- [#1290](https://github.com/Shopify/hydrogen/pull/1290) [`437b1616`](https://github.com/Shopify/hydrogen/commit/437b1616fcfa15d8b4b2c033b364b2f74b99d6e4) Thanks [@jplhomer](https://github.com/jplhomer)! - Allow cart queries to be customized by adding a new `cartFragment` prop to `CartProvider`. [Learn more](https://shopify.dev/api/hydrogen/components/cart/cartprovider#cart-fragment).

### Patch Changes

- [#1247](https://github.com/Shopify/hydrogen/pull/1247) [`ee64873e`](https://github.com/Shopify/hydrogen/commit/ee64873ece372f9be2d6eb08b0594a91f4ed135a) Thanks [@frandiox](https://github.com/frandiox)! - Improve the way client components are discovered in order to reduce bundle sizes.

* [#1276](https://github.com/Shopify/hydrogen/pull/1276) [`c6ce6a43`](https://github.com/Shopify/hydrogen/commit/c6ce6a43bbb944b67aec5fdc7e5566768846dac5) Thanks [@frandiox](https://github.com/frandiox)! - Fix page loading in Firefox during development ([known bug](https://bugzilla.mozilla.org/show_bug.cgi?id=1737882)).

- [#1286](https://github.com/Shopify/hydrogen/pull/1286) [`53270249`](https://github.com/Shopify/hydrogen/commit/5327024995ff7b8823ddb8ea835b3a5b95175841) Thanks [@jplhomer](https://github.com/jplhomer)! - Fix some sourcemap warnings in server console

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

### Patch Changes

- [#1264](https://github.com/Shopify/hydrogen/pull/1264) [`dc966e86`](https://github.com/Shopify/hydrogen/commit/dc966e86b35ffc8a41d8d62e129884926b8db8bc) Thanks [@arlyxiao](https://github.com/arlyxiao)! - Add more bots into user agents

* [#1245](https://github.com/Shopify/hydrogen/pull/1245) [`07866e82`](https://github.com/Shopify/hydrogen/commit/07866e8277dfa3195ef1896b16a58df495a9155f) Thanks [@0x15f](https://github.com/0x15f)! - [#1245](https://github.com/Shopify/hydrogen/pull/1245) - Support optional `priority` prop on Image component. When `true`, the image will be eagerly loaded. Defaults to `false`.

- [#1272](https://github.com/Shopify/hydrogen/pull/1272) [`c1888652`](https://github.com/Shopify/hydrogen/commit/c188865255c5f20d9db285e375c57127030e23e6) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Remove flight chunk

## 0.18.0

### Minor Changes

- [#1065](https://github.com/Shopify/hydrogen/pull/1065) [`81ae47fd`](https://github.com/Shopify/hydrogen/commit/81ae47fdb01be06af155a61e574d43c73122c414) Thanks [@frandiox](https://github.com/frandiox)! - A new config file `hydrogen.config.js` replaces the existing `shopify.config.js` in your Hydrogen app.

  ## Introducing `hydrogen.config.js`

  Hydrogen apps now expect a `hydrogen.config.js` in the root folder. This config file accepts Shopify storefront credentials, routes, session configuration, and more.

  To migrate existing apps, you should create a `hydrogen.config.js` (or `hydrogen.config.ts`) file in your Hydrogen app:

  ```js
  import {defineConfig} from '@shopify/hydrogen/config';
  import {
    CookieSessionStorage,
    PerformanceMetricsServerAnalyticsConnector,
  } from '@shopify/hydrogen';

  export default defineConfig({
    routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
    shopify: {
      storeDomain: 'YOUR_STORE.myshopify.com',
      storefrontToken: 'YOUR_STOREFRONT_TOKEN',
      storefrontApiVersion: '2022-07',
    },
    session: CookieSessionStorage('__session', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
    }),
    serverAnalyticsConnectors: [PerformanceMetricsServerAnalyticsConnector],
  });
  ```

  Then, update your `App.server.jsx` to remove previous arguments from `renderHydrogen()`:

  ```diff
  import renderHydrogen from '@shopify/hydrogen/entry-server';

  -function App({routes}) {
  +function App() {
    return (
      <Suspense fallback={<LoadingFallback />}>
  -      <ShopifyProvider shopifyConfig={shopifyConfig}>
  +      <ShopifyProvider>
          <CartProvider>
            <DefaultSeo />
            <Router>
  -            <FileRoutes routes={routes} />
  +            <FileRoutes />
              <Route path="*" page={<NotFound />} />
            </Router>
          </CartProvider>
          <PerformanceMetrics />
          {process.env.LOCAL_DEV && <PerformanceMetricsDebug />}
        </ShopifyProvider>
      </Suspense>
    );
  }

  -const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');
  -
  -export default renderHydrogen(App, {
  -  routes,
  -  shopifyConfig,
  -  session: CookieSessionStorage('__session', {
  -    path: '/',
  -    httpOnly: true,
  -    secure: process.env.NODE_ENV === 'production',
  -    sameSite: 'strict',
  -    maxAge: 60 * 60 * 24 * 30,
  -  }),
  -  serverAnalyticsConnectors: [PerformanceMetricsServerAnalyticsConnector],
  -});
  +export default renderHydrogen(App);
  ```

  Next, update `vite.config.js` in your app to remove references to `shopifyConfig`:

  ```diff
  import {defineConfig} from 'vite';
  import hydrogen from '@shopify/hydrogen/plugin';
  -import shopifyConfig from './shopify.config';

  // https://vitejs.dev/config/
  export default defineConfig({
  -  plugins: [hydrogen(shopifyConfig)],
  +  plugins: [hydrogen()],
  ```

  Finally, delete `shopify.config.js` from your app.

  [Read more about the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/configuration)

* [#1214](https://github.com/Shopify/hydrogen/pull/1214) [`58ef6d69`](https://github.com/Shopify/hydrogen/commit/58ef6d69f1148e7bc8452fa77e7e8f54396c6105) Thanks [@frehner](https://github.com/frehner)! - Upgraded SFAPI version to 2022-07

- [#1232](https://github.com/Shopify/hydrogen/pull/1232) [`d3956d62`](https://github.com/Shopify/hydrogen/commit/d3956d623adb86371ab214b102b53c62ea9ce26c) Thanks [@arlyxiao](https://github.com/arlyxiao)! - Upgrade body-parser in hydrogen package

### Patch Changes

- [#1211](https://github.com/Shopify/hydrogen/pull/1211) [`f3d26511`](https://github.com/Shopify/hydrogen/commit/f3d26511b1b0b94de1a43f76a0be9d99b5f2a8f7) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Build chunks are inside assets folder

* [#1215](https://github.com/Shopify/hydrogen/pull/1215) [`a0ed7c06`](https://github.com/Shopify/hydrogen/commit/a0ed7c06d045a0063a356097dafcc25e5361aad1) Thanks [@frehner](https://github.com/frehner)! - `useMoney` now returns two additional properties: `withoutTrailingZeros` and `withoutTrailingZerosAndCurrency`

  `<Money />` now has two additional and optional props: `withoutMoney` and `withoutCurrency`.

- [#1242](https://github.com/Shopify/hydrogen/pull/1242) [`c277c688`](https://github.com/Shopify/hydrogen/commit/c277c68836d6d75d509cc68c74e3ccd33706a0c7) Thanks [@blittle](https://github.com/blittle)! - Prevent JSON parsing from prototype poisoning vulnerabilities

* [#1210](https://github.com/Shopify/hydrogen/pull/1210) [`a844d26e`](https://github.com/Shopify/hydrogen/commit/a844d26ef258c28fded5293054389b719f0b86f4) Thanks [@blittle](https://github.com/blittle)! - Add eslint back and fix stale product options

## 0.17.3

### Patch Changes

- [#1096](https://github.com/Shopify/hydrogen/pull/1096) [`0a15376e`](https://github.com/Shopify/hydrogen/commit/0a15376ec806054ddd5848d9dbfa6e50a85beb49) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Make performance data available with ClientAnalytics and optional for developers to include

* [#1209](https://github.com/Shopify/hydrogen/pull/1209) [`d0dada0a`](https://github.com/Shopify/hydrogen/commit/d0dada0a0b3170d2cb885d2f29bbbef0c6d9e9e4) Thanks [@blittle](https://github.com/blittle)! - Make metafields optional within the ProductProvider. Fixes #1127

## 0.17.2

### Patch Changes

- [#1161](https://github.com/Shopify/hydrogen/pull/1161) [`6b963fb1`](https://github.com/Shopify/hydrogen/commit/6b963fb1fdd2824683870c8ff3258447bf7fedea) Thanks [@merwan7](https://github.com/merwan7)! - Adds ability to add multiple cookies in one response

* [#1162](https://github.com/Shopify/hydrogen/pull/1162) [`5446d544`](https://github.com/Shopify/hydrogen/commit/5446d544f151e233e909e6a6f002e87863ae6151) Thanks [@arlyxiao](https://github.com/arlyxiao)! - Upgrade body-parser

- [#1200](https://github.com/Shopify/hydrogen/pull/1200) [`7fb7ee49`](https://github.com/Shopify/hydrogen/commit/7fb7ee497091df3177d53e8745edcae6ba99a87d) Thanks [@blittle](https://github.com/blittle)! - Add bot user agents for Seoradar and Adresults, resolves #1199

* [#1167](https://github.com/Shopify/hydrogen/pull/1167) [`0a5ac1cb`](https://github.com/Shopify/hydrogen/commit/0a5ac1cbec449eefe48041ed6aceaac375dfa601) Thanks [@benjaminsehl](https://github.com/benjaminsehl)! - Only warn in console on missing Model3D alt tag, do not throw error

- [#1152](https://github.com/Shopify/hydrogen/pull/1152) [`d3e3e695`](https://github.com/Shopify/hydrogen/commit/d3e3e695457e6eb2a3ebf9767e0f10cc3570e880) Thanks [@jplhomer](https://github.com/jplhomer)! - Fix scroll restoration when server props are changed

## 0.17.1

### Patch Changes

- [#1145](https://github.com/Shopify/hydrogen/pull/1145) [`865b66e9`](https://github.com/Shopify/hydrogen/commit/865b66e95d67965543bcb92f0f9f15b5742f3596) Thanks [@jplhomer](https://github.com/jplhomer)! - Fix search params on navigation

* [#1139](https://github.com/Shopify/hydrogen/pull/1139) [`93525637`](https://github.com/Shopify/hydrogen/commit/9352563761c0405f2e2b39cb6b8b8f577f2522b9) Thanks [@blittle](https://github.com/blittle)! - Fix the scroll restoration on page transitions

- [#1144](https://github.com/Shopify/hydrogen/pull/1144) [`dec5eb8e`](https://github.com/Shopify/hydrogen/commit/dec5eb8e34e75c806aa1cfea935814d228ab29d6) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - fix 0.17 build

## 0.17.0

### Minor Changes

- [#1044](https://github.com/Shopify/hydrogen/pull/1044) [`c8f5934d`](https://github.com/Shopify/hydrogen/commit/c8f5934d85db63162a13256cfcf21098b390887b) Thanks [@blittle](https://github.com/blittle)! - Hydrogen now has a built in session and cookie implementation. Read more about [how sessions work in Hydrogen](https://shopify.dev/custom-storefronts/hydrogen/sessions). The starter template also includes a cookie session storage implementation. To use the new session implementation within an existing Hydrogen app:

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

* [#881](https://github.com/Shopify/hydrogen/pull/881) [`a31babfb`](https://github.com/Shopify/hydrogen/commit/a31babfb9bf73b732a18487582cec129acbb8b5e) Thanks [@jplhomer](https://github.com/jplhomer)! - ## Change from serverState to serverProps

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

- [#1098](https://github.com/Shopify/hydrogen/pull/1098) [`f3dafec4`](https://github.com/Shopify/hydrogen/commit/f3dafec4b3113c85e33a15ee70b3f91c741e74f9) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Obfuscate chunk filename on production build

### Patch Changes

- [#1131](https://github.com/Shopify/hydrogen/pull/1131) [`8199023b`](https://github.com/Shopify/hydrogen/commit/8199023b88924db156e2a687dd6dfce2665ab638) Thanks [@blittle](https://github.com/blittle)! - Fix hydration issue where strings with $ would get converted to a single $

* [#1105](https://github.com/Shopify/hydrogen/pull/1105) [`57ececf8`](https://github.com/Shopify/hydrogen/commit/57ececf82ee0c264abc256df8b02555772cc2419) Thanks [@frehner](https://github.com/frehner)! - Regenerate the graphql.schema.json which should fix the sudden end-of-line termination, and makes the schema valid again.

- [#1099](https://github.com/Shopify/hydrogen/pull/1099) [`6b50d371`](https://github.com/Shopify/hydrogen/commit/6b50d37158aab1a4a82626e09865d27e14adfbfb) Thanks [@blittle](https://github.com/blittle)! - Fix Hydrogen to not hard fail when client analytics doesn't load. Analytics might fail to load due to client-side adblockers.

## 0.16.1

### Patch Changes

- [#1102](https://github.com/Shopify/hydrogen/pull/1102) [`59ee791a`](https://github.com/Shopify/hydrogen/commit/59ee791ac81f41764b4ab3e5dd667c0c72b672d3) Thanks [@frandiox](https://github.com/frandiox)! - Do not call client exported functions during RSC.

## 0.16.0

### Patch Changes

- [#1082](https://github.com/Shopify/hydrogen/pull/1082) [`bd14340c`](https://github.com/Shopify/hydrogen/commit/bd14340c3099a0bf375a5879410cdf0697ed22f6) Thanks [@jplhomer](https://github.com/jplhomer)! - Update `useUrl()` to allow a developer to subscribe to a reactive version of the current router location.

  Example:

  ```jsx
  import {useUrl} from '@shopify/hydrogen/client';

  function MyClientComponent() {
    const url = useUrl();

    useEffect(() => {
      // Record navigation, analytics, etc
    }, [url]);
  }
  ```

* [#1075](https://github.com/Shopify/hydrogen/pull/1075) [`05dea552`](https://github.com/Shopify/hydrogen/commit/05dea552c90862a125b5111993003355a019b556) Thanks [@jplhomer](https://github.com/jplhomer)! - Properly set buyer IP and secret token for API Route queryShop helper

## 0.15.0

### Minor Changes

- [#983](https://github.com/Shopify/hydrogen/pull/983) [`52af261b`](https://github.com/Shopify/hydrogen/commit/52af261ba2bf6ed08e232b9fb2d75e69905f4cc6) Thanks [@jplhomer](https://github.com/jplhomer)! - Introduce Suspense-friendly `fetchSync` API for server and client components.

  When using `fetchSync` in server components, you provide options for caching and preloading. This is similar to the [`useQuery` hook](https://shopify.dev/api/hydrogen/hooks/global/usequery):

  ```jsx
  import {fetchSync, CacheMinutes} from '@shopify/hydrogen';
  import {Suspense} from 'react';

  export function MyServerComponent() {
    return (
      <Suspense fallback="Loading...">
        <MyThings />
      </Suspense>
    );
  }

  function MyThings() {
    const things = fetchSync('https://3p.api.com/things.json', {
      preload: true,
      cache: CacheMinutes(),
    }).json();

    return <h2>{things.title}</h2>;
  }
  ```

  When using `fetchSync` in client components, you cannot provide options for caching and preloading. You must import `fetchSync` from `@shopify/hydrogen/client`:

  ```jsx
  import {fetchSync} from '@shopify/hydrogen/client';
  import {Suspense} from 'react';

  export function MyClientComponent() {
    return (
      <Suspense fallback="Loading...">
        <MyThings />
      </Suspense>
    );
  }

  function MyThings() {
    const things = fetchSync('https://3p.api.com/things.json').json();

    return <h2>{things.title}</h2>;
  }
  ```

* [#890](https://github.com/Shopify/hydrogen/pull/890) [`a4c6d6c4`](https://github.com/Shopify/hydrogen/commit/a4c6d6c4d31337cecbd4d5afb76887bcd31ceb65) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Analytics instrumentation - this provides integration points for both server
  and client side analytics instrumentations

  - [Usage documentation](https://shopify.dev/custom-storefronts/hydrogen/analytics)

### Patch Changes

- [#1061](https://github.com/Shopify/hydrogen/pull/1061) [`a4aa3887`](https://github.com/Shopify/hydrogen/commit/a4aa3887be9f448ec1f4322fadb9821e0d19a0b5) Thanks [@jplhomer](https://github.com/jplhomer)! - Support script tags in index.html that contain line breaks

* [#1057](https://github.com/Shopify/hydrogen/pull/1057) [`06d92ddc`](https://github.com/Shopify/hydrogen/commit/06d92ddc44e03d37d2dd8a9bbeaa5fab4c4bbbd1) Thanks [@frandiox](https://github.com/frandiox)! - Ability to concatenate requests in API route handlers without leaving the server by returning a new Request instance.

  ```jsx
  // src/routes/my-page.server.jsx

  export async function api(request) {
    if (request.method === 'POST') {
      // do some work here...
    }

    return new Request(request.url, {method: 'GET'});
  }

  export default function Page() {
    return (
      <form action="/my-page" method="POST">
        ...
      </form>
    );
  }
  ```

  In the previous example, a POST request to `/my-page` would run the API handler and automatically continue with the server component rendering (GET). This is useful for handling HTML forms without waterfall requests.

- [#1049](https://github.com/Shopify/hydrogen/pull/1049) [`b88a885d`](https://github.com/Shopify/hydrogen/commit/b88a885d6b062209497a97d8ce7bcd438787d53c) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Support sub request cache control header `stale-while-revalidate` everywhere

* [#1047](https://github.com/Shopify/hydrogen/pull/1047) [`5268bf85`](https://github.com/Shopify/hydrogen/commit/5268bf85f61f8abf0e97788b7ae925ad4f3183b2) Thanks [@jplhomer](https://github.com/jplhomer)! - Restore scroll position when navigating using the back and forward buttons.

- [#1062](https://github.com/Shopify/hydrogen/pull/1062) [`cc172ae7`](https://github.com/Shopify/hydrogen/commit/cc172ae778bad0d654adcd2f41d4a548d1d94a0a) Thanks [@jplhomer](https://github.com/jplhomer)! - Fix encoding of quotes in CSS Modules which caused hydration errors

* [#1046](https://github.com/Shopify/hydrogen/pull/1046) [`3947d53a`](https://github.com/Shopify/hydrogen/commit/3947d53a99868a1e218bfab958b824ce0484615a) Thanks [@michenly](https://github.com/michenly)! - Fixed server Cookie bug where initializing with empty string will resulted in 1 item in the Cookies Map.

- [#1059](https://github.com/Shopify/hydrogen/pull/1059) [`401f329d`](https://github.com/Shopify/hydrogen/commit/401f329d331bebc4842204d4df39c4dd6797b4e1) Thanks [@frandiox](https://github.com/frandiox)! - Fix link prefetch mismatch due to query-string

* [#1072](https://github.com/Shopify/hydrogen/pull/1072) [`47c0c184`](https://github.com/Shopify/hydrogen/commit/47c0c18411eb20fa6652a981b09fd65cbed38304) Thanks [@michenly](https://github.com/michenly)! - Improve type for ShopifyContextValue to be based on ShopifyConfig.

## 0.14.0

### Minor Changes

- [#1028](https://github.com/Shopify/hydrogen/pull/1028) [`ba174588`](https://github.com/Shopify/hydrogen/commit/ba174588d8f4a9f1054779a9bf32a92e8d2c921c) Thanks [@michenly](https://github.com/michenly)! - Starting from SF API version `2022-04`, the preferred way to request translatable resources is using the `@inContext` directive. See the [API docs](https://shopify.dev/api/examples/multiple-languages#retrieve-translations-with-the-storefront-api) on how to do this and which resources have translatable properties.

  This causes a breaking change to the `useShopQuery` hook. The `locale` property has been removed from the argument object; `Accept-Language` is no longer being send with every request, and we are no longer using locale as part of the cache key.

  The `useShop` hook will now return the `languageCode` key, which is the first two characters of the existing `locale` key.

  Both `locale` & `languageCode` values are also now capitalized to make it easier to pass into a GraphQL `@inContext` directive.

* [#1020](https://github.com/Shopify/hydrogen/pull/1020) [`e9529bc8`](https://github.com/Shopify/hydrogen/commit/e9529bc81410e0d99f9d3dbdb138ae61d00f876b) Thanks [@jplhomer](https://github.com/jplhomer)! - Preload `Link` URLs by default when a user signals intent to visit the URL. This includes hovering or focusing on the URL. To disable preloading, pass `<Link preload={false} />` to the component.

### Patch Changes

- [#1017](https://github.com/Shopify/hydrogen/pull/1017) [`4c87fb63`](https://github.com/Shopify/hydrogen/commit/4c87fb639a79da883f99c58acde0d17c713c7620) Thanks [@frandiox](https://github.com/frandiox)! - Do not cache Storefront API responses that contain GraphQL errors (amend previous fix).

* [#1039](https://github.com/Shopify/hydrogen/pull/1039) [`3a297862`](https://github.com/Shopify/hydrogen/commit/3a29786202947fab0bfe876042b37a91923ed637) Thanks [@frandiox](https://github.com/frandiox)! - Update to Vite 2.9

- [#1026](https://github.com/Shopify/hydrogen/pull/1026) [`836b064d`](https://github.com/Shopify/hydrogen/commit/836b064d1648fb1a9f209a08a82ee5c20f7dfba9) Thanks [@frehner](https://github.com/frehner)! - Updated the Typescript types and GraphQL schema to the newest updates from Storefront API 2022-04. Of note in this update is the ability to skip `edges` and go directly to `node`, for example: `product.nodes[0]` instead of `product.edges[0].node`

* [#1032](https://github.com/Shopify/hydrogen/pull/1032) [`03488083`](https://github.com/Shopify/hydrogen/commit/034880833dc500f66f9b67417c00099c283dfa67) Thanks [@jplhomer](https://github.com/jplhomer)! - Catch hydration errors related to experimental server components bugs and prevent them from being logged in production.

- [#1037](https://github.com/Shopify/hydrogen/pull/1037) [`13376efb`](https://github.com/Shopify/hydrogen/commit/13376efbe4db93efd705b6900a6198708bc37e69) Thanks [@jplhomer](https://github.com/jplhomer)! - Use new header for private Storefront token

## 0.13.2

### Patch Changes

- [#1013](https://github.com/Shopify/hydrogen/pull/1013) [`94dc94ae`](https://github.com/Shopify/hydrogen/commit/94dc94aeb9dfd5e0120cab610203fdb4f0c61d3c) Thanks [@jplhomer](https://github.com/jplhomer)! - Fix CORS issue in StackBlitz

## 0.13.1

### Patch Changes

- [#1008](https://github.com/Shopify/hydrogen/pull/1008) [`ca1de82b`](https://github.com/Shopify/hydrogen/commit/ca1de82bc38c1c02caa451fb52065da499555e6f) Thanks [@frandiox](https://github.com/frandiox)! - Allow passing `cache` parameter to `createServer` in Node entry.

* [#997](https://github.com/Shopify/hydrogen/pull/997) [`fffdc08f`](https://github.com/Shopify/hydrogen/commit/fffdc08f87f71592352a2eb67a63e80704054db2) Thanks [@frandiox](https://github.com/frandiox)! - Allow empty array values in flattenConnection utility.

- [#1007](https://github.com/Shopify/hydrogen/pull/1007) [`7cfca7b0`](https://github.com/Shopify/hydrogen/commit/7cfca7b09289e028a463ababb51e69b4e3943d94) Thanks [@scottdixon](https://github.com/scottdixon)! - Fix API index routes https://github.com/Shopify/hydrogen/issues/562

* [#1000](https://github.com/Shopify/hydrogen/pull/1000) [`6d0d5068`](https://github.com/Shopify/hydrogen/commit/6d0d50686029c3d66d9dc0ceb0b5f71456c7b19e) Thanks [@frandiox](https://github.com/frandiox)! - Do not cache Storefront API responses that contain GraphQL errors.

- [#1003](https://github.com/Shopify/hydrogen/pull/1003) [`d8a9c929`](https://github.com/Shopify/hydrogen/commit/d8a9c9290aaf7c9d058b2c08567294822bea5396) Thanks [@jplhomer](https://github.com/jplhomer)! - Update useShopQuery to accept a custom Storefront API secret token, and forward the Buyer IP.

## 0.13.0

### Minor Changes

- [#922](https://github.com/Shopify/hydrogen/pull/922) [`b5eaddc1`](https://github.com/Shopify/hydrogen/commit/b5eaddc113106ae946fd4b5273ff1485c74a2741) Thanks [@frehner](https://github.com/frehner)! - Fragments and their related types have been removed:

  - ExternalVideoFragment and ExternalVideoFragmentFragment
  - Model3DFragment and Model3DFragmentFragment
  - ImageFragment and ImageFragmentFragment
  - MoneyFragment and MoneyFragmentFragment
  - UnitPriceFragment and UnitPriceFragmentFragment
  - VideoFragment and VideoFragmentFragment
  - MetafieldFragment and MetafieldFragmentFragment
  - Seo fragments and types:
    - DefaultPageSeoFragment and DefaultPageSeoFragmentFragment
    - HomeSeoFragment and HomeSeoFragmentFragment
    - ProductSeoFragment and ProductSeoFragmentFragment
    - CollectionSeoFragment and CollectionSeoFragmentFragment
    - PageSeoFragment and PageSeoFragmentFragment
  - MediaFile fragments and types:
    - MediaFileFragment and MediaFileFragmentFragment
    - MediaFileFragment_ExternalVideo_Fragment
    - MediaFileFragment_MediaImage_Fragment
    - MediaFileFragment_Model3d_Fragment
    - MediaFileFragment_Video_Fragment
  - ProductFragment and ProductFragmentFragment

  These fragments have been removed to reduce the chances of over-fetching (in other words, querying for fields you don't use) in your GraphQL queries. Please refer to the [Storefront API documentation](https://shopify.dev/api/storefront) for information and guides.

* [#912](https://github.com/Shopify/hydrogen/pull/912) [`de0e0d6a`](https://github.com/Shopify/hydrogen/commit/de0e0d6a6652463243ee09013cd30830ce2a246a) Thanks [@blittle](https://github.com/blittle)! - Change the country selector to lazy load available countries. The motivation to do so is that a _lot_ of countries come with the Demo Store template. The problem is 1) the graphql query to fetch them all is relatively slow and 2) all of them get serialized to the browser in each RSC response.

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

  See an example on how this could be done inside the Demo Store template [country selector](https://github.com/Shopify/hydrogen/blob/v1.x-2022-07/templates/template-hydrogen-default/src/components/CountrySelector.client.jsx)

- [#698](https://github.com/Shopify/hydrogen/pull/698) [`6f30b9a1`](https://github.com/Shopify/hydrogen/commit/6f30b9a1327f06d648a01dd94d539c7dcb3061e0) Thanks [@jplhomer](https://github.com/jplhomer)! - Basic end-to-end tests have been added to the default Hydrogen template. You can run tests in development:

  ```bash
  yarn test
  ```

  Or in continuous-integration (CI) environments:

  ```bash
  yarn test:ci
  ```

* [#932](https://github.com/Shopify/hydrogen/pull/932) [`507c5cbf`](https://github.com/Shopify/hydrogen/commit/507c5cbf233a7f3ca05094e839656de227243299) Thanks [@jplhomer](https://github.com/jplhomer)! - Adds [CSS Modules](https://github.com/css-modules/css-modules) support. Hydrogen now includes a [Vite plugin](https://vitejs.dev/guide/features.html#css-modules) that collects styles for each CSS Module and exports them to a `StyleTag` component. To use CSS Modules in your Hydrogen app, you must render the style tag in the component along with your styles:

  ```js
  import * as styles from './styles.module.css';

  export default MyComponent() {
    return (
      <div className={styles.wrapper}>
        // A style is rendered inline
        <styles.StyleTag />
        <p>Hello</p>
      </div>
    );
  }
  ```

  Explore an [example implementation of CSS Modules in GitHub](https://github.com/Shopify/hydrogen/tree/main/examples/css-modules).

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

- [#870](https://github.com/Shopify/hydrogen/pull/870) [`4c0fcd8f`](https://github.com/Shopify/hydrogen/commit/4c0fcd8f55a7956ab4641f12a5d9ebcb2587264c) Thanks [@frandiox](https://github.com/frandiox)! - Remove useQuery hook from client exports to avoid leaking server logic to the browser.

* [#950](https://github.com/Shopify/hydrogen/pull/950) [`d19fc36b`](https://github.com/Shopify/hydrogen/commit/d19fc36ba548d64a3548df435358ae5bea7cdf8e) Thanks [@frandiox](https://github.com/frandiox)! - Allow disabling minification in vite.config.js

- [#981](https://github.com/Shopify/hydrogen/pull/981) [`8dda8a86`](https://github.com/Shopify/hydrogen/commit/8dda8a860bc1cf58511756b6fff999fb7caa6081) Thanks [@michenly](https://github.com/michenly)! - Fix useUrl() when it is in RSC mode

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

- [#904](https://github.com/Shopify/hydrogen/pull/904) [`1b46f8d0`](https://github.com/Shopify/hydrogen/commit/1b46f8d00ed5db9abaf0868574e252fa319a8ca9) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Log query key when provided in string

* [#758](https://github.com/Shopify/hydrogen/pull/758) [`0bee3af0`](https://github.com/Shopify/hydrogen/commit/0bee3af0373acad85dba38a630d3a81e52d6c134) Thanks [@frandiox](https://github.com/frandiox)! - Upgrade to React experimental version `0.0.0-experimental-2bf7c02f0-20220314`.

  To upgrade your Hydrogen app, change the pinned version of `react` and `react-dom` in your `package.json` file to this version, or run:

  ```bash
  yarn add @shopify/hydrogen react@0.0.0-experimental-2bf7c02f0-20220314 react-dom@0.0.0-experimental-2bf7c02f0-20220314
  ```

- [#895](https://github.com/Shopify/hydrogen/pull/895) [`1017b541`](https://github.com/Shopify/hydrogen/commit/1017b541c275c030f97ee6dee1e310df1fe89fb5) Thanks [@frandiox](https://github.com/frandiox)! - Improve error thrown in development when entry point fails on load.

* [#897](https://github.com/Shopify/hydrogen/pull/897) [`c01044e6`](https://github.com/Shopify/hydrogen/commit/c01044e6b4ebe74f8e2e310e78dbaa8178536016) Thanks [@blittle](https://github.com/blittle)! - Add new custom headers for storefront API calls. See Issue [#660](https://github.com/Shopify/hydrogen/issues/660)

- [#908](https://github.com/Shopify/hydrogen/pull/908) [`8f4cd100`](https://github.com/Shopify/hydrogen/commit/8f4cd1005ce9d78a1426223b6d4ad44c3cae2ebc) Thanks [@mcvinci](https://github.com/mcvinci)! - Hydrogen docs: Updates to align with latest release

* [#871](https://github.com/Shopify/hydrogen/pull/871) [`4cb07c73`](https://github.com/Shopify/hydrogen/commit/4cb07c7357cf05cc63f9d3c2834ac3c43e8859b5) Thanks [@scottdixon](https://github.com/scottdixon)! - Hydrogen docs: Update ProductProvider example query

- [#878](https://github.com/Shopify/hydrogen/pull/878) [`587aa3e6`](https://github.com/Shopify/hydrogen/commit/587aa3e6b7bee39f8f8a88685ef95ec9bb7c057b) Thanks [@frandiox](https://github.com/frandiox)! - Fix preloading queries in workers to prevent waterfall requests.

  **Breaking change**: `fetchBuilder` no longer accepts a `Request` argument. Instead, it now accepts a `url: string` and `options: FetchInit`:

  ```diff
  -fetchBuilder(new Request('https://my.endpoint.com', {headers: {foo: 'bar'}}));
  +fetchBuilder('https://my.endpoint.com', {headers: {foo: 'bar}});
  ```

* [#923](https://github.com/Shopify/hydrogen/pull/923) [`993be985`](https://github.com/Shopify/hydrogen/commit/993be9856f32f282f14e5c893abfa0a69c5636a4) Thanks [@frandiox](https://github.com/frandiox)! - Provide a Logger option to use GraphQL and disable by default. Improve logging of unused query properties.

- [#960](https://github.com/Shopify/hydrogen/pull/960) [`2e8a5ea2`](https://github.com/Shopify/hydrogen/commit/2e8a5ea24c4d506b14ad3b5b9ed81147a879fc2e) Thanks [@mcvinci](https://github.com/mcvinci)! - Hydrogen docs: Add reference to robots.txt.server.js file

## 0.12.0

### Minor Changes

- [`8271be8`](https://github.com/Shopify/hydrogen/commit/8271be83331c99f27a258e6532983da4fe4f0b5b) Thanks [@michenly](https://github.com/michenly)! - Export Seo components Fragement and use them in the Demo Store template.

* [#827](https://github.com/Shopify/hydrogen/pull/827) [`745e8c0`](https://github.com/Shopify/hydrogen/commit/745e8c0a87a7c41803934565e5a756295ff629c2) Thanks [@michenly](https://github.com/michenly)! - Move any static `Fragment` properties on components to the entry point `@shopify/hydrogen/fragments`.
  The migration diff are as follows:

  ```diff
  - import {ExternalVideoFragment} from '@shopify/hydrogen';
  + import {ExternalVideoFragment} from '@shopify/hydrogen/fragments';
  - import type {ExternalVideoFragmentFragment} from '@shopify/hydrogen';
  + import type {ExternalVideoFragmentFragment} from '@shopify/hydrogen/fragments';
  ```

  ```diff
  - import {ImageFragment} from '@shopify/hydrogen';
  + import {ImageFragment} from '@shopify/hydrogen/fragments';
  - import type {ImageFragmentFragment} from '@shopify/hydrogen';
  + import type {ImageFragmentFragment} from '@shopify/hydrogen/fragments';
  ```

  ```diff
  - import {MediaFileFragment} from '@shopify/hydrogen';
  + import {MediaFileFragment} from '@shopify/hydrogen/fragments';
  - import type {MediaFileFragmentFragment} from '@shopify/hydrogen';
  + import type {MediaFileFragmentFragment} from '@shopify/hydrogen/fragments';
  ```

  ```diff
  - import {MetafieldFragment} from '@shopify/hydrogen';
  + import {MetafieldFragment} from '@shopify/hydrogen/fragments';
  - import type {MetafieldFragmentFragment} from '@shopify/hydrogen';
  + import type {MetafieldFragmentFragment} from '@shopify/hydrogen/fragments';
  ```

  ```diff
  - import {Model3DFragment} from '@shopify/hydrogen';
  + import {Model3DFragment} from '@shopify/hydrogen/fragments';
  - import type {Model3DFragmentFragment} from '@shopify/hydrogen';
  + import type {Model3DFragmentFragment} from '@shopify/hydrogen/fragments';
  ```

  ```diff
  - import {MoneyFragment} from '@shopify/hydrogen';
  + import {MoneyFragment} from '@shopify/hydrogen/fragments';
  - import type {MoneyFragmentFragment} from '@shopify/hydrogen';
  + import type {MoneyFragmentFragment} from '@shopify/hydrogen/fragments';
  ```

  ```diff
  - import {ProductProviderFragment} from '@shopify/hydrogen';
  + import {ProductProviderFragment} from '@shopify/hydrogen/fragments';
  - import type {ProductProviderFragmentFragment} from '@shopify/hydrogen';
  + import type {ProductProviderFragmentFragment} from '@shopify/hydrogen/fragments';
  ```

  ```diff
  - import {UnitPriceFragment} from '@shopify/hydrogen';
  + import {UnitPriceFragment} from '@shopify/hydrogen/fragments';
  - import type {UnitPriceFragmentFragment} from '@shopify/hydrogen';
  + import type {UnitPriceFragmentFragment} from '@shopify/hydrogen/fragments';
  ```

  ```diff
  - import {VideoFragment} from '@shopify/hydrogen';
  + import {VideoFragment} from '@shopify/hydrogen/fragments';
  - import type {VideoFragmentFragment} from '@shopify/hydrogen';
  + import type {VideoFragmentFragment} from '@shopify/hydrogen/fragments';
  ```

- [#455](https://github.com/Shopify/hydrogen/pull/455) [`81ac653`](https://github.com/Shopify/hydrogen/commit/81ac6534b8464e187b09ee13525319ed0c6c7c1d) Thanks [@johncraigcole](https://github.com/johncraigcole)! - Updated the ExternalVideo component to use the new `embedUrl` Storefront API ([introduced in 2022-04](https://shopify.dev/api/release-notes/2022-04#non-encoded-object-ids-in-the-graphql-storefront-api)) on ExternalVideo.

* [#809](https://github.com/Shopify/hydrogen/pull/809) [`47f23f9`](https://github.com/Shopify/hydrogen/commit/47f23f921873b782947aed2e54d997ad034801b8) Thanks [@frehner](https://github.com/frehner)! - Upgrade default Storefront API to version '2022-04'. Some components have been updated to use the 2022-04 features and types as well.

  One important change is that the `2022-04` Storefront API no longer encodes object IDs: see more [details here](https://shopify.dev/api/release-notes/2022-04#non-encoded-object-ids-in-the-graphql-storefront-api). Because of this, Hydrogen will no longer decode IDs, either, which will cause issues if you are using a previous version of the Storefront API with Hydrogen components.

- [#780](https://github.com/Shopify/hydrogen/pull/780) [`122a5c5`](https://github.com/Shopify/hydrogen/commit/122a5c5e0b70fa2a11c2c708b303da987f25fc53) Thanks [@jplhomer](https://github.com/jplhomer)! - Adds `queryShop` helper to API routes. This makes it easy to query the Storefront API, similar to how `useShopQuery` is available in server components:

  ```jsx
  // my-api.server.js

  export default function api(request, {queryShop}) {
    return await queryShop({
      query: `query ShopName { shop { name } }`,
    });
  }
  ```

  `queryShop` accepts a single argument object with the following properties:

  | Property    | Type                                                                                                                                                             | Required |
  | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
  | `query`     | `string \| ASTNode`                                                                                                                                              | Yes      |
  | `variables` | `Record<string, any>`                                                                                                                                            | No       |
  | `locale`    | `string`. Defaults to the locale value from the [LocalizationProvider](https://shopify.dev/api/hydrogen/components/localization/localizationprovider) component. | No       |

  **Important**: In order to use `queryShop`, you should pass `shopifyConfig` to `renderHydrogen` inside `App.server.jsx`:

  ```diff
  -export default renderHydrogen(App, {routes});
  +export default renderHydrogen(App, {shopifyConfig, routes});
  ```

* [#712](https://github.com/Shopify/hydrogen/pull/712) [`6368968`](https://github.com/Shopify/hydrogen/commit/6368968e4c68bb44b01b6b0b6903e403269dc233) Thanks [@blittle](https://github.com/blittle)! - Routing in Hydrogen has been updated according to [Custom Routes proposal](https://github.com/Shopify/hydrogen/discussions/569). Specifically, a new `Router` component has been added, and `DefaultRoutes` has been renamed to `FileRoutes`, along with other minor changes. Custom route components are not implemented yet.

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

- [#799](https://github.com/Shopify/hydrogen/pull/799) [`350293a`](https://github.com/Shopify/hydrogen/commit/350293a9fa113fa9950aad27cf7ccaa6b535bedb) Thanks [@michenly](https://github.com/michenly)! - Update `linesAdd` to create cart if cart does not exist.

* [#788](https://github.com/Shopify/hydrogen/pull/788) [`9d4c43d`](https://github.com/Shopify/hydrogen/commit/9d4c43d6cc4f0b52affc33274c438a356c95ad37) Thanks [@mcvinci](https://github.com/mcvinci)! - Hydrogen docs: Static assets and component props

- [#813](https://github.com/Shopify/hydrogen/pull/813) [`b1b959c`](https://github.com/Shopify/hydrogen/commit/b1b959c45ae43d7078c655b4012b6d6cd2db6491) Thanks [@frandiox](https://github.com/frandiox)! - Do not scroll to top if the URL pathname has not changed.

* [#821](https://github.com/Shopify/hydrogen/pull/821) [`548979e`](https://github.com/Shopify/hydrogen/commit/548979ea7cbc38e52628d3359fd6c4edd19b41cc) Thanks [@jplhomer](https://github.com/jplhomer)! - Add null check for ShopifyProvider

- [#850](https://github.com/Shopify/hydrogen/pull/850) [`74b14e4`](https://github.com/Shopify/hydrogen/commit/74b14e4a66c72125bc1b372c57f305a86a2e1fe4) Thanks [@blittle](https://github.com/blittle)! - Ignore when boomerang doesn't load. This often happens when a adblocker is present on the client.
  There is no longer an uncaught promise exception in the console.

* [#803](https://github.com/Shopify/hydrogen/pull/803) [`7528bf4`](https://github.com/Shopify/hydrogen/commit/7528bf4956970d76f37452bd33f9c9a692187c4f) Thanks [@frandiox](https://github.com/frandiox)! - Avoid accessing undefined global \_\_flight as a side effect of another unknown error.

- [#833](https://github.com/Shopify/hydrogen/pull/833) [`214927a`](https://github.com/Shopify/hydrogen/commit/214927a071b9350d1f70fa02c74227f1e5d77238) Thanks [@frandiox](https://github.com/frandiox)! - Disable worker streaming until it is properly supported.

* [#837](https://github.com/Shopify/hydrogen/pull/837) [`2e76d66`](https://github.com/Shopify/hydrogen/commit/2e76d66ac23d84c13cf9c60e0b7aacf9eddda9ce) Thanks [@jplhomer](https://github.com/jplhomer)! - Minify server build output

- [#819](https://github.com/Shopify/hydrogen/pull/819) [`09d9ad5`](https://github.com/Shopify/hydrogen/commit/09d9ad5d7b65942d9187c6b766bf4c60a6979453) Thanks [@jplhomer](https://github.com/jplhomer)! - Improve logging for useShopQuery errors

* [#825](https://github.com/Shopify/hydrogen/pull/825) [`1215fdb`](https://github.com/Shopify/hydrogen/commit/1215fdb02910190096c6920f533d06f00fc59a6c) Thanks [@michenly](https://github.com/michenly)! - `@shopify/hydrogen` will no longer export the following types

  - MediaFileProps
  - VideoProps
  - ImageProps
  - ExternalVideoProps
  - RawHtmlProps
  - AddToCartButtonProps
  - ModelViewerProps
  - MoneyProps
  - BuyNowButtonProps
  - BuyNowButtonPropsWeControl
  - ShopPayButtonProps

  Any Component props type should be typed instead with `React.ComponentProps<typeof MyComponent>`.

- [#792](https://github.com/Shopify/hydrogen/pull/792) [`8aad0b5`](https://github.com/Shopify/hydrogen/commit/8aad0b561ddbef55abc598c91c6e9bd642c46d9c) Thanks [@frandiox](https://github.com/frandiox)! - Attributes from `<html>` and `<body>` elements in `index.html` are now included in the SSR response.

* [#811](https://github.com/Shopify/hydrogen/pull/811) [`2226b6e`](https://github.com/Shopify/hydrogen/commit/2226b6eda30a29ad79fb89c600a210b615dc5406) Thanks [@frandiox](https://github.com/frandiox)! - Support non-PascalCase filenames for client components.

- [#786](https://github.com/Shopify/hydrogen/pull/786) [`d1ecaf7`](https://github.com/Shopify/hydrogen/commit/d1ecaf7efff4595da46b0ece08c3cd94c6cdd55f) Thanks [@frehner](https://github.com/frehner)! - Updated graphql-codegen, which updates the Typescript types available for each Storefront API object

* [#849](https://github.com/Shopify/hydrogen/pull/849) [`e64fa17`](https://github.com/Shopify/hydrogen/commit/e64fa17c61585a7dc967bef5a2216dde40b2fc42) Thanks [@blittle](https://github.com/blittle)! - Fix server the server to only log once for the full time it takes to stream render a page

- [#394](https://github.com/Shopify/hydrogen/pull/394) [`818312d`](https://github.com/Shopify/hydrogen/commit/818312d72618882056d0344f069568e71766d32d) Thanks [@sahilmob](https://github.com/sahilmob)! - Respond with 404 if the route has no matches.

* [#841](https://github.com/Shopify/hydrogen/pull/841) [`0aa74cf`](https://github.com/Shopify/hydrogen/commit/0aa74cf78dae555fc111c06df3d2b73b022af4f0) Thanks [@michenly](https://github.com/michenly)! - Update MediaFile's options prop type to included Image options.

- [#796](https://github.com/Shopify/hydrogen/pull/796) [`1dc62e2`](https://github.com/Shopify/hydrogen/commit/1dc62e2514b53411ae750d81c0a1b4f50eae9aff) Thanks [@mcvinci](https://github.com/mcvinci)! - Hydrogen docs: Strict mode

* [#813](https://github.com/Shopify/hydrogen/pull/813) [`b1b959c`](https://github.com/Shopify/hydrogen/commit/b1b959c45ae43d7078c655b4012b6d6cd2db6491) Thanks [@frandiox](https://github.com/frandiox)! - Remove Router client-only logic from server bundle and avoid extra waterfall requests during Hydration.
  Extract part of the client bundle into separate modules that can be loaded in parallel.

## 0.11.1

### Patch Changes

- [#770](https://github.com/Shopify/hydrogen/pull/770) [`71e0255`](https://github.com/Shopify/hydrogen/commit/71e0255ea48dc1caa34d2c05a1556cc0ce6d4ce9) Thanks [@mcvinci](https://github.com/mcvinci)! - Hydrogen docs: Framework and global hooks content updates

* [#761](https://github.com/Shopify/hydrogen/pull/761) [`1142647`](https://github.com/Shopify/hydrogen/commit/114264716bc8f3027e3e6395d523714adbc92014) Thanks [@frehner](https://github.com/frehner)! - Fix issue with components that take in the `as` prop not validating other props when a component is passed to `as`.

- [#752](https://github.com/Shopify/hydrogen/pull/752) [`428aa7a`](https://github.com/Shopify/hydrogen/commit/428aa7adac179dd1efffc29bf382a7bb0a2c8971) Thanks [@michenly](https://github.com/michenly)! - Ensure ProductSeo knows how to handle `featuredImage = null`

* [#774](https://github.com/Shopify/hydrogen/pull/774) [`052f148`](https://github.com/Shopify/hydrogen/commit/052f148e0d33029cdc2540afa5ead32825962f3a) Thanks [@frandiox](https://github.com/frandiox)! - Fix internal url usage in platforms like Vercel, which already provides protocol and host in `request.url`.

- [#744](https://github.com/Shopify/hydrogen/pull/744) [`2e487b7`](https://github.com/Shopify/hydrogen/commit/2e487b7e70fe0572538dc2a24b6b6b36ba9fc804) Thanks [@jplhomer](https://github.com/jplhomer)! - Switch to using Changesets for changelogs.

* [#775](https://github.com/Shopify/hydrogen/pull/775) [`d5b7ee1`](https://github.com/Shopify/hydrogen/commit/d5b7ee1d8312f64922d1f78afc82ec5ad4a3f457) Thanks [@cartogram](https://github.com/cartogram)! - In cases where the `initialVariantId` is missing on the `<ProductProvider />`, the `selectedVariantId` in the returned `object` from `useProduct()` will now use the first available variant _or_ the first variant (if non are available).

- [#773](https://github.com/Shopify/hydrogen/pull/773) [`b6a053e`](https://github.com/Shopify/hydrogen/commit/b6a053e774da443b5692dec51546f5558b3018ad) Thanks [@frandiox](https://github.com/frandiox)! - Fix server bundle name in cases where CSS or images are imported in server components.

* [#764](https://github.com/Shopify/hydrogen/pull/764) [`5e55da4`](https://github.com/Shopify/hydrogen/commit/5e55da4090692369ff6a3d57fbc6d29124bdf2e9) Thanks [@wizardlyhel](https://github.com/wizardlyhel)! - Preload queries breaking fetch on Cloudfare [#764](https://github.com/Shopify/hydrogen/pull/764)

- [#763](https://github.com/Shopify/hydrogen/pull/763) [`ea2857a`](https://github.com/Shopify/hydrogen/commit/ea2857a515866f37f392bca5da8be1139c055a64) Thanks [@frehner](https://github.com/frehner)! - Client-side apps now have React's `StrictMode` component wrapping the whole app, with an option to disable it. If you do turn it off, it is recommended that you still include the `StrictMode` component at as high of a level as possible in your React tree.

  See also [React 17's docs](https://reactjs.org/docs/strict-mode.html) on `StrictMode`, and [React 18's updates](https://github.com/reactwg/react-18/discussions/19) to `StrictMode`.

* [#747](https://github.com/Shopify/hydrogen/pull/747) [`2d8ab7e`](https://github.com/Shopify/hydrogen/commit/2d8ab7e2a8038ff8b43e6e9398e0bb2da72220a0) Thanks [@mcvinci](https://github.com/mcvinci)! - Hydrogen docs: Preloaded queries and query timing

## [0.11.0] - 2022-02-24

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

- Demo Store template GalleryPreview unique key warning
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
