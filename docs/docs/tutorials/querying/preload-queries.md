# Preload queries


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



<aside class="note beta">
<h4>Experimental feature</h4>

<p>Preloaded queries is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

This guide provides information on how to configure preloaded queries in your Hydrogen app.

## Disable preloaded queries

You can disable preloaded queries in the following ways:

- Set cache to `CacheNone`
- Opting out with `preload: false`

```js
const {data} = useShopQuery({
  query: QUERY,
  variables: {
    numCollections: 3,
  },
  cache: CacheNone(), // `CacheNone()` automatically disables preloaded queries
  preload: false,     // or you can explicitly tell the query not to preload
});
```



## Preload everywhere

Supply the `preload` property with either a Boolean value or a string. When the value is `*`, Hydrogen preloads the query for every request.

```js
const data = fetchSync('https://my.api.com/data.json', {
  headers: {
    accept: 'application/json',
  },
  // Preloads queries for every request
  preload: '*',
}).json();
```



## Log request timing information

<aside class="note beta">
<h4>Experimental feature</h4>

<p>The `showQueryTiming` property is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

Enable the `logger.showQueryTiming` property in your [Hydrogen configuration file](/tutorials/configuration/index.md#logger).
