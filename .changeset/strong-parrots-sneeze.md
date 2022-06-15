---
'@shopify/hydrogen': patch
---

Add support for `Request.formData()` within API Routes for Node 16-17. Example:

```ts
export async function api(request) {
  const formData = await request.formData();

  const username = formData.get('user');
  const password = formData.get('pass');

  ...
}
```
