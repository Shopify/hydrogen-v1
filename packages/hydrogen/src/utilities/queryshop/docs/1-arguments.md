## Arguments

The `queryShop` utility accepts a single argument object with the following properties:

| Property    | Type                                   | Description                                                                                | Required                                                                                                                   |
| ----------- | -------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | --- |
| `query`     | `string                                | ASTNode`                                                                                   | A string of the GraphQL query. If no query is provided, then the `useShopQuery` hook makes no calls to the Storefront API. | Yes |
| `variables` | `Record<string, any>`                  | An object of the variables for the GraphQL query.                                          | No                                                                                                                         |
| `locale`    | `string` (defaults to `defaultLocale`) | A string corresponding to a valid locale identifier like `en-us` used to make the request. | No                                                                                                                         |
