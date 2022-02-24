## Arguments

The `useQuery` hook takes the following arguments:

| Key            | Required | Description                                                     |
| -------------- | -------- | --------------------------------------------------------------- |
| `key`          | Yes      | A string or an array to uniquely identify the query.            |
| `queryFn`      | Yes      | An asynchronous query function like `fetch` which returns data. |
| `queryOptions` | No       | The options to manage the cache behavior of the sub-request.    |

The `queryOptions` object accepts the following properties:

| Key       | Required | Description                                                                                                                                        |
| --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cache`   | No       | An object describing the [cache policy](/custom-storefronts/hydrogen/framework/cache) for the request.                                             |
| `preload` | No       | Whether to preload the query. Defaults to `false`. Specify `true` to preload the query for the URL or `'*'` to preload the query for all requests. |
