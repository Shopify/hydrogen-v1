## Arguments

The `useShopQuery` takes an object as its only argument, with the following keys:

| Key         | Required | Description                                                                                                                                                                                                    |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`     | Yes      | A string of the GraphQL query.                                                                                                                                                                                 |
| `variables` | No       | An object of the variables for the GraphQL query.                                                                                                                                                              |
| `cache`     | No       | The [caching strategy](/custom-storefronts/hydrogen/framework/cache#caching-strategies) to help you determine which cache control header to set.                                                               |
| `preload`   | No       | Whether to [preload the query](/custom-storefronts/hydrogen/framework/preloaded-queries). Defaults to `false`. Specify `true` to preload the query for the URL or `'*'` to preload the query for all requests. |
