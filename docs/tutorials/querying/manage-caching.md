---
gid: ed301667-de50-4bca-a848-b22d27b23e7e
title: Manage caching
description:  Learn how to manage cache options for Hydrogen storefronts.
---

Combined with [streaming server-side rendering](/custom-storefronts/hydrogen/streaming-ssr), caching ensures that buyers get the quickest response possible while also displaying the latest data.

## Disable caching

You should consider disabling caching on authenticated pages to prevent leaking personal identifying information.

To disable caching, use the `CacheNone()` caching strategy.

## Create a caching strategy

If you don't want to use the [caching strategies provided by Hydrogen](/custom-storefronts/hydrogen/querying/cache#caching-strategies), then you can create your own to use in your project.

For example, you can create a cache control header with `max-age=30, must-revalidate, no-transform`:

```tsx
response.cache(
  CacheCustom({
    mode: 'must-revalidate, no-transform',
    maxAge: 30,
  })
);
```

## Modify sub-request caching

Sub-request caching keeps pages loading quickly for end-users. All sub-request have the default `CacheShort` strategy.

### `useShopQuery`

The following example shows how to implement [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery) for Shopify Storefront API queries:

{% codeblock file, filename: '/routes/my-products.server.jsx' %}

```jsx
// Use a caching strategy provided by Hydrogen
const {data} = useShopQuery({
  query: QUERY,
  cache: CacheLong(),
});
```

{% endcodeblock %}

### `fetchSync`

The following example shows how to implement [`fetchSync`](/api/hydrogen/hooks/global/fetchsync) for third-party requests:

{% codeblock file, filename: '/routes/my-products.server.jsx' %}

```jsx
// Use a caching strategy provided by Hydrogen
const data = fetchSync('https://my.3p.com/data.json', {
  cache: CacheLong(),
}).json();
```

{% endcodeblock %}

When the cached entry becomes stale, if the age of the entry is still within the `stale-while-revalidate` window, then the stale version is returned and a new version is generated in the background.

### Enable sub-request caching

Enable sub-request caching using an in-memory store.

Pass `devCache: true` to the second parameter of the Hydrogen Vite plugin:

{% codeblock file, filename: '/vite.config.js' %}

```js
export default defineConfig({
  plugins: [hydrogen({devCache: true})],
});
```

{% endcodeblock %}

## Modify full-page caching

It's helpful to cache the entire page response at the network edge and in the browser. This is the most useful for pages without dynamic or personalized data, like marketing pages or blog content. By default, Hydrogen implements a `CacheShort()` strategy for all full-page requests.

To modify full-page caching options, use the `response` property passed to the page server component:

{% codeblock file, filename: '/routes/my-products.server.jsx' %}

```jsx
export default function MyProducts({response}) {
  response.cache(CacheLong());
}
```

{% endcodeblock %}

## Manage caching in development

The following are common tasks for managing caching in development:

### Enable logging for the cache API status

Set `logger.showCacheApiStatus` to `true` in your [Hydrogen configuration file](/custom-storefronts/hydrogen/configuration#logger). The status of the cache updates on each query:

```sh
[Cache] MISS   query shopInfo
[Cache] MISS   query indexContent
[Cache] PUT    query indexContent
[Cache] MISS   query Localization
```

### Enable logging for cache control headers

Set `logger.showCacheControlHeader` to `true` in your [Hydrogen configuration file](/custom-storefronts/hydrogen/configuration#logger).

### Bust query cache busting on build

Pass `{purgeQueryCacheOnBuild: true}` to the second parameter of the Hydrogen Vite plugin:

{% codeblock file, filename: '/vite.config.js' %}

```js
export default defineConfig({
  plugins: [hydrogen({purgeQueryCacheOnBuild: true})],
});
```

{% endcodeblock %}

## Caching in production

Sub-request caching uses an instance of [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) passed to the entry point. You can manage caching in production for different runtimes.

### Worker-based runtimes

Provide a `cache` option to `handleRequest`:

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

### Node.js-based runtimes

Provide a `cache` option to `hydrogenMiddleware`:

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

- [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery)
- [`fetchSync`](/api/hydrogen/hooks/global/fetchsync)
- [`useQuery`](/api/hydrogen/hooks/global/usequery)

## Next steps

- Improve your app's loading performance with [streaming SSR and Suspense](/custom-storefronts/hydrogen/streaming-ssr).
