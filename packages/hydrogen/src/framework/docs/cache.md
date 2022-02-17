Caching is a fundamental building block of a good shopping experience. Combined with streaming server-side rendering, caching ensures that buyers get the quickest response possible while also displaying the latest data.

Hydrogen provides two mechanisms for cache within applications:

- [Sub-request caching](#sub-request-caching)
- [Full-page caching](#full-page-caching)

Hydrogen also includes [default values for each mechanism](#default-values).

> Note:
> If you’re interacting with personalized or private data, then you need to override these defaults to meet your needs.

## Caching strategies

Hydrogen includes recommended caching strategies to help you determine which
cache control header to set.

| Caching strategy | Cache control header                                      | Cache duration |
| ---------------- | --------------------------------------------------------- | -------------- |
| `CacheSeconds()` | `public, max-age=1, stale-while-revalidate=9`             | 10 seconds     |
| `CacheMinutes()` | `public, max-age=900, stale-while-revalidate=900`         | 30 minutes     |
| `CacheHours()`   | `public, max-age=1800, stale-while-revalidate=1800`       | 1 hour         |
| `CacheDays()`    | `public, max-age=3600, stale-while-revalidate=82800`      | 1 Day          |
| `CacheWeeks()`   | `public, max-age=604800, stale-while-revalidate=604800`   | 2 Weeks        |
| `CacheMonths()`  | `public, max-age=1296000, stale-while-revalidate=1296000` | 1 Month        |
| `CacheCustom()`  | Define your own cache control header                      | Custom         |

### Example

```jsx
import {CacheSeconds} from '@shopify/hydrogen';
response.cache(CacheSeconds());
```

## Build your own caching strategies

If you don't want to use the caching strategies provided by Hydrogen, then you can create your own to use in your project.

For example, you can create a cache control header with `max-age=30, must-revalidate, no-transform`:

```tsx
response.cache(
  CacheCustom({
    mode: 'must-revalidate, no-transform',
    maxAge: 30,
  })
);
```

### Cache options

Each mechanism accepts the same cache options API based on the [`Cache-Control` HTTP Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control):

```ts
export interface AllCacheOptions {
  mode?: string;
  maxAge?: number;
  staleWhileRevalidate?: number;
  sMaxAge?: number;
  staleIfError?: number;
}
```

| Name                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mode`                 | Sets options that don't need a duration: <ul><li>`no-store`: The response is prevented from being cached at any layer. This is useful for private or time-sensitive data.</li><li>`private`: The response is cached in a user’s browser but not at the hosting or edge layer. This is useful for private or customized data.</li><li>`must-revalidate`: The response must revalidate with the server when `max-age` time is expired. |
| `maxAge`               | Correlates with the `max-age` cache control header. Instructs the cache how long to store an entry.                                                                                                                                                                                                                                                                                                                                  |
| `staleWhileRevalidate` | Correlates with the `stale-while-revalidate` cache control header. Instructs the cache how long after an entry’s `max-Age` is acceptable to serve a stale entry. Another request for fresh data is made in the background.                                                                                                                                                                                                           |
| `sMaxAge`              | Correlates with the `s-maxage` cache control header. Instructs the cache how long to store an entry on CDN or proxy caches.                                                                                                                                                                                                                                                                                                          |
| `staleIfError`         | Correlates with the `stale-if-error` cache control header. Instructs how long browser is allow to use cached entry when entry returns a 5xx status error.                                                                                                                                                                                                                                                                            |

> Note:
> There are other available cache control headers, but some of them aren't applicable to Hydrogen. For example, the `no-cache` option instructs the browser to not use the cached entry until it returns a `304 (Not Modified)` status from server. However, the Hydrogen server doesn't send a 304 status on a request.

## Sub-request caching

While rendering a page in your Hydrogen app, it’s common to make one or more sub-requests to Shopify or other third-party data sources within server components. You should use sub-request caching to keep pages loading quickly for end-users. All sub-request have the default `CacheSeconds` strategy.

The following example shows how to implement [`useShopQuery` for Shopify Storefront API queries](/api/hydrogen/hooks/global/useshopquery):

{% codeblock file, filename: '/pages/my-products.server.jsx' %}

```jsx
// Use a caching strategy provided by Hydrogen
const {data} = useShopQuery({
  query: QUERY,
  cache: CacheHours(),
});
```

{% endcodeblock %}

The following example shows how to implement [`useQuery` for third-party requests](/api/hydrogen/hooks/global/usequery):

{% codeblock file, filename: '/pages/my-products.server.jsx' %}

```jsx
// Use a caching strategy provided by Hydrogen
const {data} = useQuery(
  'cache-key',
  async () => await fetch('https://my.3p.com/data.json').then(res => res.json()),
  {
    cache: CacheHours(),
  }
});
```

{% endcodeblock %}

When the cached entry becomes stale, if the age of the entry is still within the `stale-while-revalidate` window, then the stale version is returned and a new version is generated in the background.

## Full-page caching

In addition to sub-request caching, it’s helpful to cache the entire page response at the network edge and in the browser. This is the most useful for pages without dynamic or personalized data, like marketing pages or blog content. All sub-requests implement a default `CacheSeconds()` strategy.

To modify full-page caching options, use the `response` property passed to the page server component:

{% codeblock file, filename: '/pages/my-products.server.jsx' %}

```jsx
export default function MyProducts({response}) {
  response.cache(CacheDays());
}
```

{% endcodeblock %}

## Default values

Hydrogen provides sensible defaults for all sub-requests and full-page requests cache options.

By default, each full-page and sub-request receives the following cache options:

```js
public, max-age=1, stale-while-revalidate=9
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

For Worker-based runtimes, you can provide a `cache` option to `handleRequest`:

{% codeblock file, filename: '/worker.js' %}

```js
addEventListener('fetch', (event) => {
  event.respondWith(
    handleEvent(event, {
      // Your implementation of `Cache`. Defaults to `caches.default` for Oxygen support.
      cache: caches.default,

      // ...
    })
  );
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
