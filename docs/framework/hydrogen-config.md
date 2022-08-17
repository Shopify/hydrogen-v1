---
gid: 939381b8-6caf-4567-b3f8-df5d68c81888
title: Hydrogen configuration
description: Learn about Hydrogen's configuration properties and how to change the location of the configuration file.
---

The configuration properties for Hydrogen are located in the `hydrogen.config.js` or `hydrogen.config.ts` file at the root of your project.

This guide describes Hydrogen's configuration properties and how to change the location of the configuration file.

## Example configuration

The Hydrogen configuration file contains information that's needed at runtime for routing, connecting to the Storefront API, and many other options. The following example shows a basic Hydrogen configuration file:

{% codeblock file, filename: 'hydrogen.config.js' %}

```tsx
import {defineConfig} from '@shopify/hydrogen/config';

/* The `defineConfig` function is an optional utility that provides types for the configuration object. */
export default defineConfig({
  /* The routes defined by Vite's import.meta.globEager method. */
  routes: '/src/routes',
  /* The information that your app needs to connect to the Storefront API. */
  shopify: {
    /* The domain of your Shopify store */
    storeDomain: '{shop_domain}.myshopify.com',
    /* Your app's Storefront API access token */
    storefrontToken: '{storefront_api_access_token}',
    /* The Storefront API version that your app uses */
    storefrontApiVersion: '2022-07',
  },
  /* A path to a custom page to render when the server encounters an unhandled exception */
  serverErrorPage: '/src/Error.jsx',
});
```

{% endcodeblock %}

## Configuration properties

The following groupings of configuration properties can exist in Hydrogen:

- [`routes`](#routes)
- [`shopify`](#shopify)
- [`session`](#session)
- [`serverAnalyticsConnectors`](#serveranalyticsconnectors)
- [`logger`](#logger)
- [`strictMode`](#strictmode)
- [`poweredByHeader`](#poweredbyheader)

### `routes`

The `routes` property specifies a path to find server components and API handlers. The default value for the `routes` property is `/src/routes`, but you can specify the value to any path that starts from the project root:

{% codeblock file, filename: 'hydrogen.config.js' %}

```tsx
export default defineConfig({
  /* Path from the project root to the files for server components and API handlers */
  routes: '/path/to/routes',
});
```

{% endcodeblock %}

If your app requires a more advanced configuration, then you can provide additional information about routes manually:

{% codeblock file, filename: 'hydrogen.config.js' %}

```tsx
export default defineConfig({
  routes: {
    /* Path from the project root to the files for server components and API handlers */
    files: '/path/to/routes',
    /* A path that's prepended to all file routes. You can modify `basePath`
     * if you want to prefix all file routes. For example, you can prefix all file routes with a locale.
     */
    basePath: '/',
  },
});
```

{% endcodeblock %}

### `shopify`

The `shopify` property contains all the information that your app needs to connect to the Storefront API. This configuration is passed automatically to the [`ShopifyProvider`](https://shopify.dev/api/hydrogen/components/global/shopifyprovider) component in your app.

{% codeblock file, filename: 'hydrogen.config.js' %}

```tsx
export default defineConfig({
  shopify: {
    /* The app's default language */
    defaultLanguage: 'EN',
    /* The app's default country */
    defaultCountry: 'US',
    /* The domain of your Shopify store */
    storeDomain: '{shop_domain}.myshopify.com',
    /* Your app's Storefront API access token */
    storefrontToken: '{storefront_api_access_token}',
    /* The Storefront API version that your app uses */
    storefrontApiVersion: '2022-07',
  },
});
```

{% endcodeblock %}

For advanced use cases, you can provide a function that returns the same properties. For example, this approach is useful when the Storefront API connection varies depending on the domain or a subpath of the URL:

{% codeblock file, filename: 'hydrogen.config.ts' %}

```tsx
let myShopifyConfigCache = {};

export default defineConfig({
  shopify: (request: HydrogenRequest) => {
    // For example, you can change the configuration based on the normalized URL
    const url = new URL(request.normalizedUrl);
    const [firstUrlPart] = url.pathname.split('/');

    if (myShopifyConfigCache[firstUrlPart]) {
      // Return the cached version synchronously
      // to avoid Suspense fallback
      return myShopifyConfigCache[firstUrlPart];
    }

    // Fetch the needed information and cache it
    return fetch(`https://myApi.com/?${firstUrlPart}`)
      .then((response) => response.json())
      .then(({storeDomain, storefrontToken}) => {
        myShopifyConfigCache[firstUrlPart] = {
          storeDomain,
          storefrontToken,
          storefrontApiVersion: '2022-07',
        };

        return myShopifyConfigCache[firstUrlPart];
      });
  },
  // ...
};
```

{% endcodeblock %}

The function is called inside the [`ShopifyProvider`](https://shopify.dev/api/hydrogen/components/global/shopifyprovider) component in your app. This means that Suspense fallbacks are shown while resolving the configuration if a promise is returned.

> Tip:
> Consider caching the result of the function to speed up subsequent requests.

### `session`

The `session` property allows you to configure sessions support in your Hydrogen storefront. For more information about configuring sessions support in Hydrogen storefronts, refer to [Session management](https://shopify.dev/custom-storefronts/hydrogen/framework/sessions).

{% codeblock file, filename: 'hydrogen.config.ts' %}

```tsx
import {CookieSessionStorage} from '@shopify/hydrogen/config';

export default defineConfig({
  /* The default session storage mechanism for Hydrogen. */
  session: CookieSessionStorage('__session', {
    /* Tells the browser that the cookie should only be sent to the server if it's within the defined path.  */
    path: '/',
    /* Whether to secure the cookie so that client-side JavaScript can't read the cookie. */
    httpOnly: true,
    /* Whether to secure the cookie so that the browser only sends the cookie over HTTPS.  */
    secure: process.env.NODE_ENV === 'production',
    /* Declares that the cookie should be restricted to a first-party or same-site context.  */
    sameSite: 'strict',
    /* The number of seconds until the cookie expires. */
    maxAge: 60 * 60 * 24 * 30,
  }),
});
```

{% endcodeblock %}

### `serverAnalyticsConnectors`

The `serverAnalyticsConnectors` property allows you to [send analytics data from the server](https://shopify.dev/custom-storefronts/hydrogen/framework/analytics#send-analytics-data-from-the-server-side) in your Hydrogen app. For more information about analytics support in Hydrogen, refer to [Analytics](https://shopify.dev/custom-storefronts/hydrogen/framework/analytics).

### `logger`

The default behavior of the [`log` utility](https://shopify.dev/api/hydrogen/utilities/log) maps to the global `console` object. However, you can also customize this behavior in the configuration object.

You can pass [any method](https://shopify.dev/api/hydrogen/utilities/log#methods) of the `log` utility in the `logger` object to override the default behavior. The first argument of each log method contains a `request` object if the log was called in the same context as a request. The following Boolean options are also available:

{% codeblock file, filename: 'hydrogen.config.ts' %}

```tsx
export default defineConfig({
  logger: {
    /* Overrides the default `log.trace` behavior. */
    trace: (request, ...args) => console.log(request.url, ...args),
    /* Overrides the default `log.error` behavior. */
    error: async (request, error) => {
      console.error(error);
      // Methods can return promises. Hydrogen won't block the current
      // request but it will wait for the promises to be returned before the runtime instance ends.
      await myErrorTrackingService.send(request, error);
    },
    /* ... */

    /* Logs the cache status of each stored entry: `PUT`, `HIT`, `MISS` or `STALE`. */
    showCacheApiStatus: true,
    /* Logs the cache control headers of the main document and its sub queries. */
    showCacheControlHeader: true,
    /* Logs the timeline of when queries are being requested, resolved, and rendered.
     * This is an experimental feature. As a result, functionality is subject to change.
     * You can provide feedback on this feature by submitting an issue in GitHub:
     * https://github.com/Shopify/hydrogen/issues.*/
    showQueryTiming: true,
    /* Logs warnings in your app if you're over-fetching data from the Storefront API.
     * This is an experimental feature. As a result, functionality is subject to change.
     * You can provide feedback on this feature by submitting an issue in GitHub:
     * https://github.com/Shopify/hydrogen/issues. */
    showUnusedQueryProperties: true,
  },
});
```

{% endcodeblock %}

### `strictMode`

[Strict mode](https://reactjs.org/docs/strict-mode.html) is enabled by default for all Hydrogen storefronts in development. It includes [strict effects](https://github.com/reactwg/react-18/discussions/19), which mounts and unmounts components multiple times to catch potential issues with user or third-party code.

If strict effects cause problems for your app, then you can turn off strict mode.

{% codeblock file, filename: 'hydrogen.config.ts' %}

```tsx
export default defineConfig({
  strictMode: false,
});
```

{% endcodeblock %}

> Caution:
> If you turn off strict mode, then we recommended that you still include the `StrictMode` component at as high of a level as possible in your React tree to catch errors.

### `poweredByHeader`

By default, Hydrogen responds with the `x-powered-by: Shopify-Hydrogen` header. You can disable this by adding `poweredByHeader: false` to your config:

{% codeblock file, filename: 'hydrogen.config.ts' %}

```tsx
export default defineConfig({
  poweredByHeader: false,
});
```

{% endcodeblock %}

### `serverErrorPage`

If an unexpected error occurs while rendering a route, then Hydrogen responds with a 500 HTTP error and renders a default error page at `/src/Error.{jsx,tsx}`.

You can define a custom error page with the `serverErrorPage` configuration property. The custom error page is passed an `Error` property. The following is an example:

{% codeblock file, filename: '/src/Error.jsx' %}

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

{% endcodeblock %}

> Note:
> If Hydrogen fails to render the custom error page, then it falls back to the default built-in Error page.

## Changing the configuration file location

If you don't want the Hydrogen configuration file located at the root of your project, then you can provide the new path to the file in the Hydrogen Vite plugin (`vite.config.js`):

{% codeblock file, filename: 'vite.config.js' %}

```tsx
import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen({configPath: '../../hydrogen.config.js'})],
});
```

{% endcodeblock %}

> Note:
> The `configPath` property must be an absolute path to the Hydrogen configuration file or a relative path starting from the `vite.config.js` location.

## Related components

- [`ShopifyProvider`](https://shopify.dev/api/hydrogen/components/global/shopifyprovider)

## Next steps

- Learn about [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Get familiar with the [file-based routing system](https://shopify.dev/custom-storefronts/hydrogen/framework/routes) that Hydrogen uses.
- Learn about the Hydrogen framework's built-in support for [session management](https://shopify.dev/custom-storefronts/hydrogen/framework/sessions).
- Learn about the [analytics support](https://shopify.dev/custom-storefronts/hydrogen/framework/analytics) built into Hydrogen.
