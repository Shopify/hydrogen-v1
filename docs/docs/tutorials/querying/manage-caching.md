# Manage caching


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Combined with [streaming server-side rendering](/tutorials/streaming-ssr/), caching ensures that buyers get the quickest response possible while also displaying the latest data.

## Disable caching

You should consider disabling caching on authenticated pages to prevent leaking personal identifying information.

To disable caching, use the `CacheNone()` caching strategy.

## Create a caching strategy

If you don't want to use the [caching strategies provided by Hydrogen](/tutorials/querying/cache.md#caching-strategies), then you can create your own to use in your project.

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

The following example shows how to implement [`useShopQuery`](/hooks/global/useshopquery/) for Shopify Storefront API queries:

```jsx
// /routes/my-products.server.jsx

// Use a caching strategy provided by Hydrogen
const {data} = useShopQuery({
  query: QUERY,
  cache: CacheLong(),
});
```



### `fetchSync`

The following example shows how to implement [`fetchSync`](/hooks/global/fetchsync/) for third-party requests:

```jsx
// /routes/my-products.server.jsx

// Use a caching strategy provided by Hydrogen
const data = fetchSync('https://my.3p.com/data.json', {
  cache: CacheLong(),
}).json();
```



When the cached entry becomes stale, if the age of the entry is still within the `stale-while-revalidate` window, then the stale version is returned and a new version is generated in the background.

### Enable sub-request caching

Enable sub-request caching using an in-memory store.

Pass `devCache: true` to the second parameter of the Hydrogen Vite plugin:

```js
// /vite.config.js

export default defineConfig({
  plugins: [hydrogen({devCache: true})],
});
```



## Modify full-page caching

It's helpful to cache the entire page response at the network edge and in the browser. This is the most useful for pages without dynamic or personalized data, like marketing pages or blog content. By default, Hydrogen implements a `CacheShort()` strategy for all full-page requests.

To modify full-page caching options, use the `response` property passed to the page server component:

```jsx
// /routes/my-products.server.jsx

export default function MyProducts({response}) {
  response.cache(CacheLong());
}
```



## Manage caching in development

The following are common tasks for managing caching in development:

### Enable logging for the cache API status

Set `logger.showCacheApiStatus` to `true` in your [Hydrogen configuration file](/tutorials/configuration/index.md#logger). The status of the cache updates on each query:

```sh
[Cache] MISS   query shopInfo
[Cache] MISS   query indexContent
[Cache] PUT    query indexContent
[Cache] MISS   query Localization
```

### Enable logging for cache control headers

Set `logger.showCacheControlHeader` to `true` in your [Hydrogen configuration file](/tutorials/configuration/index.md#logger).

### Bust query cache busting on build

Pass `{purgeQueryCacheOnBuild: true}` to the second parameter of the Hydrogen Vite plugin:

```js
// /vite.config.js

export default defineConfig({
  plugins: [hydrogen({purgeQueryCacheOnBuild: true})],
});
```



## Caching in production

Sub-request caching uses an instance of [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) passed to the entry point. You can manage caching in production for different runtimes.

### Worker-based runtimes

Provide a `cache` option to `handleRequest`:

```js
// /worker.js

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



### Node.js-based runtimes

Provide a `cache` option to `hydrogenMiddleware`:

```js
// /server.js

app.use(
  '*',
  hydrogenMiddleware({
    // You need to provide a `Cache` implementation backed by something like Redis or Memcached.
    cache: customCacheImplementation,
    // ...
  })
);
```



Full-page caching is powered completely by [`cache-control` headers on the Hydrogen response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control). By default, full-page caching is enabled as long as there is a `cache` available.

## Related hooks

- [`useShopQuery`](/hooks/global/useshopquery/)
- [`fetchSync`](/hooks/global/fetchsync/)
- [`useQuery`](/hooks/global/usequery/)

## Next steps

- Improve your app's loading performance with [streaming SSR and Suspense](/tutorials/streaming-ssr/).
