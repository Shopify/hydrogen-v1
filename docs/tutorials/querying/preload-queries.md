---
gid: bc9000cb-57b1-4100-a9ca-48ab0f59bb87
title: Preload queries
description: Learn how to configure queries to preload in your Hydrogen app.
---

<aside class="note beta">
<h4>Experimental feature</h4>

<p>Preloaded queries is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

This guide provides information on how to configure preloaded queries in your Hydrogen app.

## Disable preloaded queries

You can disable preloaded queries in the following ways:

- Set cache to `CacheNone`
- Opting out with `preload: false`

{% codeblock %}

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

{% endcodeblock %}

## Preload everywhere

Supply the `preload` property with either a Boolean value or a string. When the value is `*`, Hydrogen preloads the query for every request.

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

## Log request timing information

<aside class="note beta">
<h4>Experimental feature</h4>

<p>The <code>showQueryTiming</code> property is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

Enable the `logger.showQueryTiming` property in your [Hydrogen configuration file](/custom-storefronts/hydrogen/configuration#logger).
