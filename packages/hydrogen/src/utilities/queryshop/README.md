<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/utilities/parseMetafieldValue and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `queryShop` utility is a function that helps you query the Storefront API. It's similar to the `useShopQuery` hook, which is available in server components. To use `queryShop`, pass `shopifyConfig` to `renderHydrogen` inside `App.server.jsx`.

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

| Property    | Type                                   | Description                                                                                | Required                                                                                                                   |
| ----------- | -------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | --- |
| `query`     | `string                                | ASTNode`                                                                                   | A string of the GraphQL query. If no query is provided, then the `useShopQuery` hook makes no calls to the Storefront API. | Yes |
| `variables` | `Record<string, any>`                  | An object of the variables for the GraphQL query.                                          | No                                                                                                                         |
| `locale`    | `string` (defaults to `defaultLocale`) | A string corresponding to a valid locale identifier like `en-us` used to make the request. | No                                                                                                                         |
