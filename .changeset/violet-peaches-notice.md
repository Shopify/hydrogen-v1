---
'@shopify/hydrogen': minor
---

The `enableStreaming` config option has been deprecated. The same feature can be done directly in the app:

```diff
// hydrogen.config.js

export default defineConfig({
  shopify: {
    // ...
  },
- enableStreaming: (req) => {
-   return req.headers.get('user-agent') !== 'custom bot';
- },
});
```

```diff
// App.server.jsx

-function App() {
+function App({request, response}) {
+ if (request.headers.get('user-agent') === 'custom bot') {
+   response.doNotStream();
+ }

  return <Suspense fallback={'Loading...'}>{/*...*/}</Suspense>;
}

export default renderHydrogen(App);
```
