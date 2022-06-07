---
'@shopify/hydrogen': minor
---

The `response.writeHead` method has been removed, while `response.status` and `response.statusText` are now writable.

```diff
function App({response}) {
- response.writeHead({
-   headers: {'custom-header': 'value'},
-   status: 404,
- });
+ response.headers.set('custom-header', 'value');
+ response.status = 404;
}
```
