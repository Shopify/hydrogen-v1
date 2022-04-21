The Hydrogen configuration is located in the `hydrogen.config.js` (or `hydrogen.config.ts`) file at the root of your project. It contains information needed at runtime for routing, connecting to the Storefront API, and more options.

## Example code

A simple version of the Hydrogen config looks like this:

{% codeblock file, filename: 'hydrogen.config.js' %}

```tsx
import {defineConfig} from '@shopify/hydrogen/config';

export default defineConfig({
  routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
  shopify: {
    storeDomain: '<your domain>.myshopify.com',
    storefrontToken: '<your token>',
    storefrontApiVersion: '2022-04',
  },
});
```

{% endcodeblock %}

The `defineConfig` function is an optional utility that provides types for the configuration object.

## Properties of the configuration

### `routes`

The `routes` property is where you can provide server components and API handlers using Vite's [`import.meta.globEager`](https://vitejs.dev/guide/features.html#glob-import):

{% codeblock file, filename: 'hydrogen.config.js' %}

```tsx
export default defineConfig({
  routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
  // ...
});
```

{% endcodeblock %}

By default, Hydrogen will detect the common prefix of every route and remove it from the URLs. In the previous example, `./src/routes` would be detected as the common prefix.

For advanced use cases, it's also possible to provide more information about routes manually:

{% codeblock file, filename: 'hydrogen.config.js' %}

```tsx
export default defineConfig({
  routes: {
    /* Route components and API handlers */
    files: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
    /* Common prefix in the routes that should be removed in URLs (optional) */
    dirPrefix: './src/routes',
    /* Additional prefix to use in the URLs (optional) */
    basePath: '/',
  },
  // ...
});
```

{% endcodeblock %}

### `shopify`

The `shopify` property contains all the information needed to connect to the Storefront API.

{% codeblock file, filename: 'hydrogen.config.js' %}

```tsx
export default defineConfig({
  shopify: {
    /* The application locale */
    defaultLocale: 'EN-US',
    /* The first two characters of the `locale` key */
    languageCode: 'EN',
    /* The store domain of your shop */
    storeDomain: '<your domain>.myshopify.com',
    /* A public Storefront API token */
    storefrontToken: '<your token>',
    /* The Storefront API version that your app uses */
    storefrontApiVersion: '2022-04',
  },
  // ...
});
```

{% endcodeblock %}

This configuration will be passed automatically to the `<ShopifyProvider>` in your app.

For advanced use cases, it is also possible to provide a function that returns the same properties. This is useful, for example, when the Storefront API connection varies depending on the domain or a subpath of the URL:

{% codeblock file, filename: 'hydrogen.config.ts' %}

```tsx
let myShopifyConfigCache = {};

export default defineConfig({
  shopify: (url: URL, request: Request) => {
    // For example, change config based on the URL
    const [firstUrlPart] = url.pathname.split('/');

    if (myShopifyConfigCache[firstUrlPart]) {
      // Return cached version synchronously
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
          storefrontApiVersion: '2022-04',
        };

        return myShopifyConfigCache[firstUrlPart];
      });
  },
  // ...
});
```

{% endcodeblock %}

This function will be called inside the `<ShopifyProvider>` component in your app. Therefore, Suspense fallbacks will be shown while resolving the configuration if a promise is returned.
Note that it is advisable to cache the result of this function in order to speed up subsequent requests.

## Changing the config file location

If your project structure needs to place the `hydrogen.config.js` file in a different place, you can do so by providing the new path to the file in the Hydrogen Vite plugin (in `vite.config.js`):

{% codeblock file, filename: 'vite.config.js' %}

```tsx
import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen({configPath: '../../hydrogen.config.js'})],
});
```

The `configPath` property must be an absolute path to the `hydrogen.config.js` file or a relative path starting from the `vite.config.js` location.

{% endcodeblock %}

## Related components

- [`ShopifyProvider`](/api/hydrogen/components/global/shopifyprovider)
