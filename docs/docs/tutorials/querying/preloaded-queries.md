# Preloaded queries


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



<aside class="note beta">
<h4>Experimental feature</h4>

<p>Preloaded queries is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

This guide provides information on how preloaded queries work in your Hydrogen app.

## How preloaded queries work

Preloaded queries allow your Hydrogen app to discover and preload nested queries within a page.

In the following diagram, none of the queries (`shopInfo`, `CollectionDetails`, `layoutContent`, or `Localization`) have been preloaded:

![Shows a diagram of queries that haven't been preloaded](https://shopify.dev/assets/custom-storefronts/hydrogen/preload-queries-none-set.png)

The `shopInfo` and `CollectionDetails` queries must finish loading before `layoutContent` can start. Subsequently, `layoutContent` must finish loading before `localization` can start. This behavior is called a request waterfall, and it can severely reduce your app performance.

Because none of these queries have dependencies, it would be ideal if they all started to load in parallel up front. This process is called preloading queries, and Hydrogen does it by default:

![Shows a diagram of queries that have been preloaded](https://shopify.dev/assets/custom-storefronts/hydrogen/preload-queries-set.png)

Preloaded queries work by storing the query fetcher for the next time the same URL is requested. The first time a route is loaded, no queries are preloaded. The second time a route is loaded, Hydrogen remembers which queries were necessary to render the same route.

### Disabling preloaded queries

By default, all cached queries are preloaded. However, not all queries should be preloaded. For example, any query that returns personalized results shouldn't be preloaded. Just like caching personalized queries, preloading personalized queries can disperse data across requests.

In development mode, Hydrogen detects request waterfalls, and warns you that the query isn't preloaded:

![Shows a screenshot of request waterfall warning](https://shopify.dev/assets/custom-storefronts/hydrogen/suspense-waterfall.png)

Learn how to [disable preloaded queries](/tutorials/querying/preload-queries.md#disable-preloaded-queries).

### Routes with parameters

Preloaded queries work similarly for routes with parameters, like `Product` and `Collection`, except that each route with a different parameter has its own preloaded queries.

For example, the first time a user visits `/collections/freestyle-collection`, no queries will be preloaded. Similarly, the first time a user visits `/collections/backcountry-collection`, no queries will be preloaded. However, the second time that a user visits either route, queries will be preloaded. It's important that each route has separate preloaded queries, otherwise the results of one might show up for the results of the other.

## Preload everywhere

You can tell Hydrogen to [preload a query everywhere](/tutorials/querying/preload-queries.md#preload-everywhere). This option can be helpful for menu links in your navigation, because it allows you to preload a query on button click or while you animate a transition to another page.

## Debug query timings

<aside class="note beta">
<h4>Experimental feature</h4>

<p>The `showQueryTiming` property is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

If you have a suspense waterfall detected, then you can log request timing information by enabling the `logger.showQueryTiming` property in your [Hydrogen configuration file](/tutorials/configuration/index.md#logger).

The [`showQueryTiming`](/tutorials/configuration/index.md#logger) property logs the timeline of when queries are being requested, resolved, and rendered. If a query is preloaded, but isn't being used, then a warning displays in the server log:

![Shows a screenshot of preloaded query warning](https://shopify.dev/assets/custom-storefronts/hydrogen/preload-query-warning.png)

If a query is being double loaded, then a warning displays in the server log. This error typically happens when the preloaded query isn't the same query as the one requested:

![Shows a screenshot of query being double loaded](https://shopify.dev/assets/custom-storefronts/hydrogen/double-loaded-query.png)

## Related components and hooks

- [`ShopifyProvider`](/components/global/shopifyprovider/)
- [`fetchSync`](/hooks/global/fetchsync/)
- [`useShopQuery`](/hooks/global/useshopquery/)
- [`useQuery`](/hooks/global/usequery/)

## Next steps

- Learn how to perform common tasks for [preloading queries](/tutorials/querying/preload-queries/).
- Learn about the [analytics support](/tutorials/analytics/) built into Hydrogen.
