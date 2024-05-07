# Caching


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Caching is a fundamental building block of a good shopping experience. Combined with [streaming server-side rendering](/tutorials/streaming-ssr/), caching ensures that buyers get the quickest response possible while also displaying the latest data.

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

Learn how to [build your own caching strategy](/tutorials/querying/manage-caching.md#create-a-caching-strategy).

### Example

```jsx
import {CacheShort} from '@shopify/hydrogen';
response.cache(CacheShort());
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
| `mode`                 | Sets options that don't need a duration: <ul><li>`no-store`: The response is prevented from being cached at any layer. This is useful for private or time-sensitive data.</li><li>`private`: The response is cached in a user’s browser but not at the hosting or edge layer. This is useful for private or customized data.</li><li>`must-revalidate`: The response must revalidate with the server when `max-age` time is expired.</li></ul> |
| `maxAge`               | Correlates with the `max-age` cache control header. Instructs the cache how long to store an entry.                                                                                                                                                                                                                                                                                                                                  |
| `staleWhileRevalidate` | Correlates with the `stale-while-revalidate` cache control header. Instructs the cache how long after an entry’s `max-Age` is acceptable to serve a stale entry. Another request for fresh data is made in the background.                                                                                                                                                                                                           |
| `sMaxAge`              | Correlates with the `s-maxage` cache control header. Instructs the cache how long to store an entry on CDN or proxy caches.                                                                                                                                                                                                                                                                                                          |
| `staleIfError`         | Correlates with the `stale-if-error` cache control header. Instructs how long browser is allow to use cached entry when entry returns a 5xx status error.                                                                                                                                                                                                                                                                            |

> Note:
> There are other available cache control headers, but some of them aren't applicable to Hydrogen. For example, the `no-cache` option instructs the browser to not use the cached entry until it returns a `304 (Not Modified)` status from server. However, the Hydrogen server doesn't send a 304 status on a request.

## Sub-request caching

While rendering a page in your Hydrogen storefront, it’s common to make one or more sub-requests to Shopify or other third-party data sources within server components. You should use sub-request caching to keep pages loading quickly for end-users. All sub-request have the default `CacheShort` strategy.

 Learn how to [modify sub-request caching](/tutorials/querying/manage-caching.md#modify-sub-request-caching).

## Full-page caching

In addition to sub-request caching, it’s helpful to cache the entire page response at the network edge and in the browser. This is the most useful for pages without dynamic or personalized data, like marketing pages or blog content. By default, Hydrogen implements a `CacheShort()` strategy for all full-page requests.

Full-page caching is powered completely by [`cache-control` headers on the Hydrogen response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control). By default, full-page caching is enabled as long as there is a `cache` available.

Learn how to [modify full-page caching](/tutorials/querying/manage-caching.md#modify-full-page-caching)

## Default values

Hydrogen provides sensible defaults for all sub-requests and full-page requests cache options.

By default, each full-page and sub-request receives the following cache options:

```js
public, max-age=1, stale-while-revalidate=9
```

## Caching in development

A cache control header report displays for each page request. The report includes the associated queries that built the request and the cache control headers:

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

> Sub-request caching is disabled by default during development. Learn how to [enable sub-request caching](/tutorials/querying/manage-caching.md#enable-sub-request-caching).

## Caching in production

Learn common tasks for [managing caching in production](/tutorials/querying/manage-caching.md#caching-in-production).
## Related hooks

- [`useShopQuery`](/hooks/global/useshopquery/)
- [`fetchSync`](/hooks/global/fetchsync/)
- [`useQuery`](/hooks/global/usequery/)

## Next steps

- Learn how to perform common tasks for [managing caching in Hydrogen](/tutorials/querying/manage-caching/).
