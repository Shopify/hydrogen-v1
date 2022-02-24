## Arguments

The `useQuery` hook takes the following arguments:

| Key        | Required | Description                                          |
| ---------- | -------- | ---------------------------------------------------- |
| `cacheKey` | Yes      | A string or an array to uniquely identify the query. |
| `queryFn`  | Yes      | An asynchronous function that returns data.          |
| `options`  | No       | An object describing the options for the request.    |

The `options` object accepts the following properties:

| Key       | Required | Description                                                                                            |
| --------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `cache`   | No       | An object describing the [cache policy](/custom-storefronts/hydrogen/framework/cache) for the request. |
| `preload` | No       | A boolean or string to preload this query                                                              |
