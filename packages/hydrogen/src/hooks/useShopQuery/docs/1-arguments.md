## Arguments

The `useShopQuery` takes an object as its only argument, with the following keys:

| Key         | Required | Description                                                                                                                                        |
| ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`     | Yes      | A string of the GraphQL query.                                                                                                                     |
| `variables` | No       | An object of the variables for the GraphQL query.                                                                                                  |
| `cache`     | No       | The [caching strategy](/custom-storefronts/hydrogen/framework/cache#caching-strategies) to help you determine which cache control header to set.   |
| `locale`    | No       | A string corresponding to a valid locale identifier that's used to make the request. For example, `en-us`.                                         |
| `preload`   | No       | Whether to preload the query. Defaults to `false`. Specify `true` to preload the query for the URL or `'*'` to preload the query for all requests. |
