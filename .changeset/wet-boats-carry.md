---
'@shopify/hydrogen': patch
---

Allow concatenating requests with a header. For example, if you want the route `/shop` to proxy render everything on `/products`, setup an API route at `/routes/shop.server.jsx` with the following:

```jsx
export async function api(request) {
  return new Request(new URL(request.url).origin + '/products', {
    headers: {
      'Hydrogen-Concatenate': 'true',
    },
  });
}
```
