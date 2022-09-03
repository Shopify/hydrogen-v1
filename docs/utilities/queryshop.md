---
gid: 574c35e8-209f-8fv2-b896-b3763d8c060c
title: queryShop
description: The queryShop utility is a function that helps you query the Storefront API within API routes.
---

The `queryShop` utility is a function that helps you query the Storefront API within `API` routes. `queryShop` is the `API` route version of [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery), which is available in server components.

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
| `locale`    | `string`                                        | A string corresponding to a valid locale identifier like `EN-US` used to make the request. Defaults to the locale value from the [`ShopifyProvider`](https://shopify.dev/api/hydrogen/components/global/shopifyprovider) component. | No       |
