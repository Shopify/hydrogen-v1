---
'@shopify/hydrogen': minor
'create-hydrogen-app': minor
---

**Breaking change**: The `routes` property in `hydrogen.config.js` file has been simplified. It is now a string that represents the path to the routes from the project root:

```diff
// hydrogen.config.js

export default defineConfig({
-  routes: import('./src/routes/**/*.server.[jt](s|sx)'),
+  routes: '/src/routes',
});
```

Its default value is `/src/routes` so this property can be removed when using this directory.

In the object syntax version, `dirPrefix` is removed and `files` becomes a string:

```diff
// hydrogen.config.js

export default defineConfig({
  routes: {
-   files: import('./src/routes/**/*.server.[jt](s|sx)'),
-   dirPrefix: './src/routes',
+   files: '/src/routes',
    basePath: '/',
  },
});
```
