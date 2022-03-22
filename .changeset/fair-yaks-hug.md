---
'@shopify/hydrogen': patch
'create-hydrogen-app': patch
---

Fix server redirects to work properly with RSC responses. For example, the redirect component within the starter template needs to change:

```diff
export default function Redirect({response}) {
-  response.redirect('/products/snowboard');
-  return <div>This page is redirected</div>;
+  return response.redirect('/products/snowboard');
}
```

This server component is rendered two ways:

1. When an app directly loads the redirect route, the server will render a 300 redirect with the proper location header.
2. The app is already loaded, but the user navigates to the redirected route. We cannot 300 respond in this scenario, instead `response.redirect(...)` returns a component which will redirect on the client.
