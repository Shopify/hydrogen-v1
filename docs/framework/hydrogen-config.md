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

/* All properties in this configuration file are required. */

/* The `defineConfig` function is an optional utility that provides types for the configuration object. */
export default defineConfig({
  /* The routes defined by Vite's import.meta.globEager method. */
  routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
  /* The information that your app needs to connect to the Storefront API. */
  shopify: {
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

## Configuration properties

The following groupings of configuration properties can exist in Hydrogen:

- [`routes`](#routes)
- [`shopify`](#shopify)
- [`session`](#session)
- [`serverAnalyticsConnectors`](#serveranalyticsconnectors)
- [`enableStreaming`](#enablestreaming)

### `routes`

The `routes` property is where you can provide server components and API handlers using Vite's [`import.meta.globEager`](https://vitejs.dev/guide/features.html#glob-import) method.

By default, Hydrogen detects the common prefix of every route and removes it from the URLs. In the following example, `./src/routes` would be detected as the common prefix:

{% codeblock file, filename: 'hydrogen.config.js' %}

```tsx
export default defineConfig({
  routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
});
```

{% endcodeblock %}

If your app requires a more advanced configuration, then you can provide additional information about routes manually:

{% codeblock file, filename: 'hydrogen.config.js' %}

```tsx
export default defineConfig({
  routes: {
    /* The file routes for server components and API handlers */
    files: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
    /* (Optional) The portion of the file route path that shouldn't be a part of the URL.
     * You need to modify this if you want to import your routes from a location other
     than the default `src/routes`.
    */
    dirPrefix: './src/routes',
    /* (Optional) A path that's prepended to all file routes. You can modify `basePath`
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
    /* The app's locale */
    defaultLocale: 'EN-US',
    /* The first two characters of the `locale` key */
    languageCode: 'EN',
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
  shopify: (request: ServerComponentRequest) => {
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

The `session` property allows you to configure sessions support in your Hydrogen app. For more information about configuring sessions support in Hydrogen apps, refer to [Session management](https://shopify.dev/custom-storefronts/hydrogen/framework/sessions).

{% codeblock file, filename: 'hydrogen.config.ts' %}

```tsx
import {CookieSessionStorage} from '@shopify/hydrogen';
export default defineConfig({
  /* The default session storage mechanism for Hydrogen. */
  session: CookieSessionStorage('__session', {
    /* Tells the browser that the cookie should only be sent to the server if it's within the defined path.  */
    path: '/',
    /* Whether to secure the cookie so that the browser only sends it over HTTPS.  */
    httpOnly: true,
    /* Whether to secure the cookie so that client JavaScript is unable to read it. */
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

{% codeblock file, filename: 'hydrogen.config.ts' %}

```tsx
import {PerformanceMetricsServerAnalyticsConnector} from '@shopify/hydrogen';
export default defineConfig({
  serverAnalyticsConnectors: [PerformanceMetricsServerAnalyticsConnector],
});
```

{% endcodeblock %}

### `enableStreaming`

By default, all routes in Hydrogen are stream rendered. Stream rendering is automatically disabled when the user agent is a bot. 

Content should be immediately available to bots for SEO purposes. However, you might want to manually disable streaming for a specific page. A common use case is disabling streaming for a custom bot that's not recognized by Hydrogen's bot detection algorithm. You can disable streaming for a custom bot with the `enableStreaming` configuration property:

{% codeblock file, filename: 'hydrogen.config.ts' %}

```tsx
import {PerformanceMetricsServerAnalyticsConnector} from '@shopify/hydrogen';
export default defineConfig({
  enableStreaming: (req) => req.headers.get('user-agent') !== 'custom bot',
});
```

{% endcodeblock %}

> Tip:
> There are [performance benefits](https://shopify.dev/custom-storefronts/hydrogen/best-practices/performance) to streaming. You shouldn't completely disable streaming for all of your storefront's routes.

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
- Learn about the [analytics support](https://shopify.dev/custom-storefronts/hydrogen/framework/analytics) built into Hydrogen apps.
