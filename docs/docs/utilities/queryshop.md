# queryShop


The `queryShop` utility is a function that helps you query the Storefront API within `API` routes. `queryShop` is the `API` route version of [`useShopQuery`](/hooks/global/useshopquery/), which is available in server components.

## Example code

```jsx title="my-api.server.js"
export default function api(request, {queryShop}) {
  return await queryShop({
    query: `query ShopName { shop { name } }`,
  });
}
```



## Arguments

The `queryShop` utility accepts a single argument object with the following properties:

| Property    | Type                                            | Description                                                                                                                                                                                                                                         | Required |
| ----------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `query`     | `string` &#124; `ASTNode` | A string of the GraphQL query. If no query is provided, then the `useShopQuery` hook makes no calls to the Storefront API.                                                                                                                          | Yes      |
| `variables` | `Record<string, any>`                           | An object of the variables for the GraphQL query.                                                                                                                                                                                                   | No       |
| `locale`    | `string`                                        | A string corresponding to a valid locale identifier like `EN-US` used to make the request. Defaults to the locale value from the [`ShopifyProvider`](/components/global/shopifyprovider/) component. | No       |
