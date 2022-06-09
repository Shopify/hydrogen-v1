---
'@shopify/hydrogen': minor
---

In an effort to be performant by default, the [preloaded queries](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries) are turned on by default when caching is also enabled. By default, each query has caching enabled too, so `preload` will on universally by default.
