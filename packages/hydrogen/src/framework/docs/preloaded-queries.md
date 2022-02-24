This guide provides information on how preloaded queries work and how to configure them in your Hydrogen app.

## How preloaded queries work

Preloaded queries allow your Hydrogen app to discover and preload nested queries within a page.

In the following diagram, none of the queries (`shopInfo`, `CollectionDetails`, `layoutContent`, or `Localization`) have been preloaded:

![Shows a diagram of queries that haven't been preloaded](/assets/custom-storefronts/hydrogen/preload-queries-none-set.png)

However, if you set the `layoutContent` and `Localization` queries to preload, then the Hydrogen app discovers these queries and loads them faster:

![Shows a diagram of queries that have been preloaded](/assets/custom-storefronts/hydrogen/preload-queries-set.png)

### No preloaded queries

Preloaded queries work by storing the query fetcher for the next time the same URL is requested. For example, on the `/` URL, Shopify fetches queries for the following:

- `shopInfo`
- `layoutContent`
- `localization`
- `homeShopInfo`
- `welcomeContent`
- `indexContent`

If you don't set any of these queries with `preload: true`, then no queries will be preloaded:

![Shows a screenshot of no preloaded queries](/assets/custom-storefronts/hydrogen/no-preloaded-queries.png)

### Some preloaded queries

If you set a some queries to preload, then on the first time `/` is requested, no queries will be preloaded. However, all requests to `/` afterwards will preload `homeShopInfo`, `welcomeContent` and `indexContent` queries:

- `shopInfo`
- `layoutContent`
- `localization`
- `homeShopInfo` - `preload: true`
- `welcomeContent` - `preload: true`
- `indexContent` - `preload: true`

![Shows a screenshot of some preloaded queries](/assets/custom-storefronts/hydrogen/some-preloaded-queries.png)

### Wildcard routes

Preloaded queries work similarly for wildcard routes like `Product` and `Collection`, except that each URL has its own preload queries.

#### Example

You've set `CollectionDetails` to preload queries:

- `shopInfo`
- `layoutContent`
- `localization`
- `CollectionDetails` - `preload: true`

The first time a user visits `/collections/freestyle-collection`, no queries will be preloaded. Similarly, the first time a user visits `/collections/backcountry-collection`, no queries will be preloaded. However, the second time that a user visits `/collections/freestyle-collection`, `CollectionDetails` will be preloaded.

![Shows a screenshot of preloaded queries in wildcard routes](/assets/custom-storefronts/hydrogen/wild-card-preloaded-queries.png)

## Preload a query

You can add an option to preload a query anywhere in your Hydrogen app.

The `preload` property takes a Boolean value or a string:

- `preload: true`: Preloads a query for a specific URL.
- `preload: '*'`: Preloads a query for every request. This option can be helpful for menu links in your navigation, allowing you to preload a query on button click or while you animate a transition to another page.

> Note:
> By default, preloaded queries are turned off because not all queries should be preloaded. For example, any queries that are specific to cart or customer functionality shouldn't be preloaded.

{% codeblock %}

```js
const {data} = useShopQuery({
  query: QUERY,
  variables: {
    numCollections: 3,
  },
  cache: CacheHours(),
  // Preloads queries for a specific URL
  preload: true,
});

const {data} = useQuery(
  ['unique', 'key'],
  async () => {
    const response = await fetch('https://my.api.com/data.json', {
      headers: {
        accept: 'application/json',
      },
    });

    return await response.json();
  },
  {
    // Preloads queries for every request
    preload: '*',
  }
);
```

{% endcodeblock %}

## Test a preloaded query

To test a preloaded query, enable the `showQueryTiming` property in `App.server.js`. The [`showQueryTiming`](/api/hydrogen/utilities/log#logger-options) property logs the timeline of when queries are being requested, resolved, and rendered.

{% codeblock file, filename: "App.server.js" %}

```js
import {setLoggerOptions} from '@shopify/hydrogen';
...
setLoggerOptions({
  showQueryTiming: true
})
```

{% endcodeblock %}

If a query is preloaded, but isn't being used, then a warning displays in the server log:

![Shows a screenshot of preloaded query warning](/assets/custom-storefronts/hydrogen/preload-query-warning.png)

If a query is being double loaded, then a warning displays in the server log. This error typically happens when the preloaded query isn't the same query as the one requested:

![Shows a screenshot of query being double loaded](/assets/custom-storefronts/hydrogen/double-loaded-query.png)

## Next steps

- Learn how to manage the [state on the server](/custom-storefronts/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/custom-storefronts/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
