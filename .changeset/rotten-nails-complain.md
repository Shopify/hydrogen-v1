---
'@shopify/hydrogen': minor
---

**Breaking change**: The `setLogger` and `setLoggerOptions` utilities have been removed. The same information can now be passed under the `logger` property in Hydrogen config:

```diff
// App.server.jsx

-import {setLogger, setLoggerOptions} from '@shopify/hydrogen';

-setLogger({
-  trace() {},
-  error() {},
-  // ...
-});

-setLoggerOptions({
-  showQueryTiming: true,
-  showCacheControlHeader: true,
-  // ...
-});

function App() {
  // ...
}

export default renderHydrogen(App);
```

```diff
// hydrogen.config.js

export default defineConfig({
  // ...
+ logger: {
+   trace() {},
+   error() {},
+   showQueryTiming: true,
+   showCacheControlHeader: true,
+   // ...
+ },
});
```
