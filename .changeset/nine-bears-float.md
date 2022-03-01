---
'@shopify/hydrogen': minor
'create-hydrogen-app': minor
---

Adds `queryShop` helper to API routes. This makes it easy to query the Storefront API, similar to how `useShopQuery` is available in server components:

```jsx
// my-api.server.js

export default function api(request, {queryShop}) {
  return await queryShop({
    query: `query ShopName { shop { name } }`,
  });
}
```

`queryShop` accepts a single argument object with the following properties:

| Property    | Type                                   | Required |
| ----------- | -------------------------------------- | -------- |
| `query`     | `string \| ASTNode`                    | Yes      |
| `variables` | `Record<string, any>`                  | No       |
| `locale`    | `string` (defaults to `defaultLocale`) | No       |

**Important**: In order to use `queryShop`, you should pass `shopifyConfig` to `renderHydrogen` inside `App.server.jsx`:

```diff
-export default renderHydrogen(App, {pages});
+export default renderHydrogen(App, {shopifyConfig, pages});
```
