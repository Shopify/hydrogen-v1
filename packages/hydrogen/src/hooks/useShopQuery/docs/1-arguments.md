## Arguments

The `useShopQuery` takes an object as its only argument, with the following keys:

| Key         | Required | Description                                                                                            |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `query`     | Yes      | A string of the GraphQL query.                                                                         |
| `variables` | No       | An object of the variables for the GraphQL query.                                                      |
| `cache`     | No       | An object describing the [cache policy](/custom-storefronts/hydrogen/framework/cache) for the request. |
| `locale`    | No       | A string corresponding to a valid locale identifier like `en-us` used to make the request.             |
