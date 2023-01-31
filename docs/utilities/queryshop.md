# queryShop


The `queryShop` utility is a function that helps you query the Storefront API within `API` routes. `queryShop` is the `API` route version of [`useShopQuery`](/docs/hooks/global/useshopquery.md), which is available in server components.

## Example code

{% codeblock file, filename: 'my-api.server.js' %}

```jsx
export default function api(request, {queryShop}) {
  return await queryShop({
    query: `query ShopName { shop { name } }`,
  });
}
```

{% endcodeblock %}

## Arguments

The `queryShop` utility accepts a single argument object with the following properties:

| Property    | Type                                            | Description                                                                                                                                                                                                                                         | Required |
| ----------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `query`     | <code>string</code> &#124; <code>ASTNode</code> | A string of the GraphQL query. If no query is provided, then the `useShopQuery` hook makes no calls to the Storefront API.                                                                                                                          | Yes      |
| `variables` | `Record<string, any>`                           | An object of the variables for the GraphQL query.                                                                                                                                                                                                   | No       |
| `locale`    | `string`                                        | A string corresponding to a valid locale identifier like `EN-US` used to make the request. Defaults to the locale value from the [`ShopifyProvider`](/docs/components/global/shopifyprovider.md) component. | No       |
