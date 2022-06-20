---
gid: 11c33bdd-ed60-4ed9-9f60-5481602021c0
title: Preloaded queries
description: Learn how to configure queries to preload in your Hydrogen app.
---

<aside class="note beta">
<h4>Experimental feature</h4>

<p>Preloaded queries is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

This guide provides information on how preloaded queries work and how to configure them in your Hydrogen app.

## How preloaded queries work

Preloaded queries allow your Hydrogen app to discover and preload nested queries within a page.

In the following diagram, none of the queries (`shopInfo`, `CollectionDetails`, `layoutContent`, or `Localization`) have been preloaded:

![Shows a diagram of queries that haven't been preloaded](/assets/custom-storefronts/hydrogen/preload-queries-none-set.png)

This means that the `shopInfo` and `CollectionDetails` queries must finish loading before `layoutContent` can start. And subsequently `layoutContent` must finish before `localization` can start. This is called a request waterfall, and can destroy your app performance. Because none of these queries have dependencies, it would be ideal if they all started to load in parallel up front. You can tell Hydrogen to do this by seting the `layoutContent` and `Localization` queries to preload:

![Shows a diagram of queries that have been preloaded](/assets/custom-storefronts/hydrogen/preload-queries-set.png)

Preloaded queries work by storing the query fetcher for the next time the same URL is requested. So the first time a route is loaded, no queries are preloaded. The second time, Hydrogen remembers which queries were necessary to render the same route.

### Disabling preloaded queries

By default, all cached querires are preloaded. But not all querires should be preloaded. Any query that returns personalized results should not be preloaded. Just like caching personalized querires, preloading personalized querires can bleed data across requests. You can disable preloaded queries by setting cache to `CacheNone` or explicitly opting out with `preload: false`:

{% codeblock %}

```js
const {data} = useShopQuery({
  query: QUERY,
  variables: {
    numCollections: 3,
  },
  cache: CacheNone(), // `CacheNone()` automatically disables preloaded queries
  preload: false,     // Or you can explicitly tell the query not to preload
});
```

{% endcodeblock %}

During dev-mode, Hydrogen detects request waterfalls, and warns you that the query isn't preloaded:

![Shows a screenshot of request waterfall warning](/assets/custom-storefronts/hydrogen/suspense-waterfall.png)

### Routes with parameters

Preloaded queries work similarly for routes with parameters, like `Product` and `Collection`, except that each route with a different parameter has it's own preloaded queries. 

For example, the first time a user visits `/collections/freestyle-collection`, no queries will be preloaded. Similarly, the first time a user visits `/collections/backcountry-collection`, no queries will be preloaded. However, the second time that a user visits either route, querires will be preloaded. It's important that each route has separate preloaded queries, otherwise the results of one might show up for the results of the other.

## Preload everywhere

You can tell Hydrogen to preload a query everywhere. The `preload` property takes a Boolean value or a string. When the value is `*` Hydrogen will preload the query for every request. This option can be helpful for menu links in your navigation, allowing you to preload a query on button click or while you animate a transition to another page:

{% codeblock %}

```js
const data = fetchSync('https://my.api.com/data.json', {
  headers: {
    accept: 'application/json',
  },
  // Preloads queries for every request
  preload: '*',
}).json();
```

{% endcodeblock %}

## Debug query timings

<aside class="note beta">
<h4>Experimental feature</h4>

<p>The `showQueryTiming` property is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

If you have a suspense waterfall detected, you can log request timing information by enabling the `logger.showQueryTiming` property in your [Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config#logger).

The [`showQueryTiming`](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config#logger) property logs the timeline of when queries are being requested, resolved, and rendered. If a query is preloaded, but isn't being used, then a warning displays in the server log:

![Shows a screenshot of preloaded query warning](/assets/custom-storefronts/hydrogen/preload-query-warning.png)

If a query is being double loaded, then a warning displays in the server log. This error typically happens when the preloaded query isn't the same query as the one requested:

![Shows a screenshot of query being double loaded](/assets/custom-storefronts/hydrogen/double-loaded-query.png)

## Related components and hooks

- [`localizationProvider`](https://shopify.dev/api/hydrogen/components/localization/localizationprovider)
- [`fetchSync`](https://shopify.dev/api/hydrogen/hooks/global/fetchsync)
- [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery)
- [`useQuery`](https://shopify.dev/api/hydrogen/hooks/global/usequery)

## Next steps

- Learn about the [analytics support](https://shopify.dev/custom-storefronts/hydrogen/framework/analytics) built into Hydrogen.
