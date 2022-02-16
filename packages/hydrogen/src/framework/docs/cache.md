Caching is a fundamental building block of a good shopping experience. Combined with streaming server-side rendering, caching ensures that buyers get the quickest response possible while also displaying the latest data.

Hydrogen provides two mechanisms for cache within applications:

- [Sub-request caching](#sub-request-caching)
- [Full-page caching](#full-page-caching)

Hydrogen also includes [default values for each mechanism](#default-values).

> Note:
> If you’re interacting with personalized or private data, then you need to override these defaults to meet your needs.

## Cache options

Each mechanism accepts the same cache options API based on the [`Cache-Control` HTTP Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control):

```ts
export interface CacheOptions {
  maxAge?: number;
  staleWhileRevalidate?: number;
  private?: boolean;
  noStore?: boolean;
}
```

| Name                   | Description                                                                                                                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxAge`               | Correlates with the `max-age` cache control header. Instructs the cache how long to store an entry.                                                                                                                                       |
| `staleWhileRevalidate` | Correlates with the `stale-while-revalidate` cache control header. Instructs the cache how long after an entry’s `max-Age` is acceptable to serve a stale entry. Another request for fresh data is made in the background.                |
| `private`              | Defaults to `false`. Correlates with the `private` cache control header. If `private` is set to `true`, then the entry is cached in a user’s browser but not at the hosting or edge layer. This is useful for private or customized data. |
| `noStore`              | Defaults to `false`. Correlates with the `no-store` cache control header. If `noStore` is set to `true`, then the entry is prevented from being cached at any layer. This is useful for private or time-sensitive data.                   |

## Sub-request caching

While rendering a page in your Hydrogen app, it’s common to make one or more sub-requests to Shopify or other third-party data sources within server components. You should use sub-request caching to keep pages loading quickly for end-users.
The following example shows how to implement [`useShopQuery` for Shopify Storefront API queries](/api/hydrogen/hooks/global/useshopquery):

{% codeblock file, filename: '/pages/my-products.server.jsx' %}

```jsx
const {data} = useShopQuery({
  query: QUERY,
  cache: {
    // Cache the data for one second.
    maxAge: 1,
    // Serve stale data for up to nine seconds while getting a fresh response in the background.
    staleWhileRevalidate: 9,
  },
});
```

{% endcodeblock %}

The following example shows how to implement [`useQuery` for third-party requests](/api/hydrogen/hooks/global/usequery):

{% codeblock file, filename: '/pages/my-products.server.jsx' %}

```jsx
const {data} = useQuery(
  'cache-key',
  async () => await fetch('https://my.3p.com/data.json').then(res => res.json()),
  {
    cache: {
      // Cache the data for one second.
      maxAge: 1,
      // Serve stale data for up to nine seconds while getting a fresh response in the background.
      staleWhileRevalidate: 9,
    },
  }
});
```

{% endcodeblock %}

When the cached entry becomes stale, if the age of the entry is still within the `stale-while-revalidate` window, then the stale version is returned and a new version is generated in the background.

## Full-page caching

In addition to sub-request caching, it’s helpful to cache the entire page response at the network edge and in the browser. This is the most useful for pages without dynamic or personalized data, like marketing pages or blog content.

To modify full-page caching options, use the `response` property passed to the page server component:

{% codeblock file, filename: '/pages/my-products.server.jsx' %}

```jsx
export default function MyProducts({response}) {
  response.cache({
    // Cache the page for one hour.
    maxAge: 60 * 60,
    // Serve the stale page for up to 23 hours while getting a fresh response in the background.
    staleWhileRevalidate: 23 * 60 * 60,
  });
}
```

{% endcodeblock %}

## Default values

Hydrogen provides sensible defaults for all sub-requests and full-page requests cache options.

By default, each sub-request receives the following cache options:

```js
{
  // Cache the data for one second.
  maxAge: 1,
  // Serve stale data for up to nine seconds while getting a fresh response in the background.
  staleWhileRevalidate: 9,
}
```

By default, each full-page receives the following cache options:

```js
{
  // Cache the page for one hour.
  maxAge: 60 * 60,
  // Serve the stale page for up to 23 hours while getting a fresh response in the background.
  staleWhileRevalidate: 23 * 60 * 60,
}
```

## Caching in development

Caching is disabled by default during development.

To enable sub-request caching using an in-memory store, pass `devCache: true` to the second parameter of the Hydrogen Vite plugin:

{% codeblock file, filename: '/vite.config.js' %}

```js
export default defineConfig({
  plugins: [hydrogen(shopifyConfig, {devCache: true})],
});
```

{% endcodeblock %}

To enable logging for the cache API status, call `setLoggerOptions` and set `showCacheApiStatus` to `true`:

{% codeblock file, filename: '/src/entry-server.jsx' %}

```js
import {setLoggerOptions} from '@shopify/hydrogen';
import App from './App.server';

setLoggerOptions({showCacheApiStatus: true});

export default renderHydrogen(App, () => {
  // Custom hook
});
```

{% endcodeblock %}

The status of the cache updates on each query:

```sh
[Cache] MISS   query shopInfo
[Cache] MISS   query indexContent
[Cache] PUT    query indexContent
[Cache] MISS   query Localization
```

To enable logging for cache control headers, call `setLoggerOptions` and set `showCacheControlHeader` to `true`:

{% codeblock file, filename: '/src/entry-server.jsx' %}

```js
import {setLoggerOptions} from '@shopify/hydrogen';
import App from './App.server';

setLoggerOptions({showCacheControlHeader: true});

export default renderHydrogen(App, () => {
  // Custom hook
});
```

{% endcodeblock %}

A cache control header report displays for each page request. The report includes the associated queries
that built the request and the cache control headers:

```sh
┌── Cache control header for http://localhost:3000/collections/freestyle-collection
│ public, max-age=3600, stale-while-revalidate=82800
│
│ query shopInfo          public, max-age=43200, stale-while-revalidate=43200
│ query CollectionDetails public, max-age=1, stale-while-revalidate=9
│ query indexContent      public, max-age=60, stale-while-revalidate=600
│ query Localization      public, max-age=3600, stale-while-revalidate=82800
└──
```

You can also preview the full-page caching headers in the network tab of your browser’s developer tools. The response header used is `cache-control-preview`.

![A screenshot of the response headers](/assets/custom-storefronts/hydrogen/response-headers.png)

## Busting query cache on build

To enable query cache busting on build, pass `{purgeQueryCacheOnBuild: true}` to the second parameter of the Hydrogen Vite plugin:

{% codeblock file, filename: '/vite.config.js' %}

```js
export default defineConfig({
  plugins: [hydrogen(shopifyConfig, {purgeQueryCacheOnBuild: true})],
});
```

{% endcodeblock %}

## Caching in production

Sub-request caching uses an instance of [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) passed to the entry point.

For Worker-based runtimes, you can provide a `cache` option to `handleEvent`:

{% codeblock file, filename: '/worker.js' %}

```js
addEventListener('fetch', (event) => {
  try {
    event.respondWith(
      handleEvent(event, {
        // Your implementation of `Cache`. Defaults to `caches.default` for Oxygen support.
        cache: caches.default,

        // ...
      })
    );
  } catch (error) {
    // ...
  }
});
```

{% endcodeblock %}

For Node.js-based runtimes, you can provide a `cache` option to `hydrogenMiddleware`:

{% codeblock file, filename: '/server.js' %}

```js
app.use(
  '*',
  hydrogenMiddleware({
    // You need to provide a `Cache` implementation backed by something like Redis or Memcached.
    cache: customCacheImplementation,
    // ...
  })
);
```

{% endcodeblock %}

Full-page caching is powered completely by [`cache-control` headers on the Hydrogen response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control). This means the network edge as well as the user’s browser is responsible managing full-page cache.

> Note:
> Oxygen caches HTML responses from Hydrogen at the network edge. However, your hosting provider or CDN might not cache HTML responses by default. Make sure to consult with your individual provider to enable HTML caching for your Hydrogen app.

## Next steps

- Learn about [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
