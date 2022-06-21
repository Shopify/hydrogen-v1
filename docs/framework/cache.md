---
gid: 038c475e-f28f-471b-a981-26e7ebb8bec9
title: Caching
description: Learn how to manage cache options for Hydrogen storefronts.
---

Caching is a fundamental building block of a good shopping experience. Combined with [streaming server-side rendering](https://shopify.dev/custom-storefronts/hydrogen/framework/streaming-ssr), caching ensures that buyers get the quickest response possible while also displaying the latest data.

Hydrogen provides two mechanisms for cache within applications:

- [Sub-request caching](#sub-request-caching)
- [Full-page caching](#full-page-caching)

Hydrogen also includes [default values for each mechanism](#default-values).

> Note:
> If you’re interacting with personalized or private data, then you need to override these defaults to meet your needs.

## Caching strategies

Hydrogen includes recommended caching strategies to help you determine which cache control header to set. The following table lists the available caching strategies and their associated cache control headers and cache durations:

| Caching strategy | Cache control header                                 | Cache duration |
| ---------------- | ---------------------------------------------------- | -------------- |
| `CacheShort()`   | `public, max-age=1, stale-while-revalidate=9`        | 10 seconds     |
| `CacheLong()`    | `public, max-age=3600, stale-while-revalidate=82800` | 1 Day          |
| `CacheNone()`    | `no-store`                                           | No cache       |
| `CacheCustom()`  | Define your own cache control header                 | Custom         |

### Example

```jsx
import {CacheShort} from '@shopify/hydrogen';
response.cache(CacheShort());
```

### Disabling caching

Use the `CacheNone()` caching strategy to disable caching. You should consider disabling caching on authenticated pages to prevent leaking personal identifying information.

### Build your own caching strategies

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

While rendering a page in your Hydrogen storefront, it’s common to make one or more sub-requests to Shopify or other third-party data sources within server components. You should use sub-request caching to keep pages loading quickly for end-users. All sub-request have the default `CacheShort` strategy.

The following example shows how to implement [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery) for Shopify Storefront API queries:

{% codeblock file, filename: '/routes/my-products.server.jsx' %}

```jsx
// Use a caching strategy provided by Hydrogen
const {data} = useShopQuery({
  query: QUERY,
  cache: CacheLong(),
});
```

{% endcodeblock %}

The following example shows how to implement [`fetchSync`](https://shopify.dev/api/hydrogen/hooks/global/fetchsync) for third-party requests:

{% codeblock file, filename: '/routes/my-products.server.jsx' %}

```jsx
// Use a caching strategy provided by Hydrogen
const data = fetchSync('https://my.3p.com/data.json', {
  cache: CacheLong(),
}).json();
```

{% endcodeblock %}

When the cached entry becomes stale, if the age of the entry is still within the `stale-while-revalidate` window, then the stale version is returned and a new version is generated in the background.

## Full-page caching

In addition to sub-request caching, it’s helpful to cache the entire page response at the network edge and in the browser. This is the most useful for pages without dynamic or personalized data, like marketing pages or blog content. By default, Hydrogen implements a `CacheShort()` strategy for all full-page requests.

To modify full-page caching options, use the `response` property passed to the page server component:

{% codeblock file, filename: '/routes/my-products.server.jsx' %}

```jsx
export default function MyProducts({response}) {
  response.cache(CacheLong());
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

Sub-request caching is disabled by default during development.

To enable sub-request caching using an in-memory store, pass `devCache: true` to the second parameter of the Hydrogen Vite plugin:

{% codeblock file, filename: '/vite.config.js' %}

```js
export default defineConfig({
  plugins: [hydrogen({devCache: true})],
});
```

{% endcodeblock %}

To enable logging for the cache API status, set `logger.showCacheApiStatus` to `true` in your [Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config#logger). The status of the cache updates on each query:

```sh
[Cache] MISS   query shopInfo
[Cache] MISS   query indexContent
[Cache] PUT    query indexContent
[Cache] MISS   query Localization
```

To enable logging for cache control headers, set `logger.showCacheControlHeader` to `true` in your [Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config#logger). A cache control header report displays for each page request. The report includes the associated queries
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

> Note:
> During development, disable cache in your browser's developer tools to make sure the latest changes are visible in your browser. For example, you can [disable cache in Chrome DevTools](https://developer.chrome.com/docs/devtools/network/reference/#disable-cache) by visiting the **Network** tab.

## Busting query cache on build

To enable query cache busting on build, pass `{purgeQueryCacheOnBuild: true}` to the second parameter of the Hydrogen Vite plugin:

{% codeblock file, filename: '/vite.config.js' %}

```js
export default defineConfig({
  plugins: [hydrogen({purgeQueryCacheOnBuild: true})],
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
      // Your implementation of `Cache`. Defaults to `await caches.open` for Oxygen support.
      cache: await caches.open('oxygen'),

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

Full-page caching is powered completely by [`cache-control` headers on the Hydrogen response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control). By default, full-page caching is enabled as long as there is a `cache` available.

## Related hooks

- [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery)
- [`fetchSync`](https://shopify.dev/api/hydrogen/hooks/global/fetchsync)
- [`useQuery`](https://shopify.dev/api/hydrogen/hooks/global/usequery)

## Next steps

- Improve your app's loading performance with [streaming SSR and Suspense](https://shopify.dev/custom-storefronts/hydrogen/framework/streaming-ssr).
