---
'create-hydrogen-app': patch
---

Use Shopify CLI to start a local development server instead of `vite`.

To update your existing apps, install the Shopify & Hydrogen CLIs:

```bash
yarn add -D @shopify/cli @shopify/cli-hydrogen
```

And update the `dev` script in your `package.json`:

```diff
-    "dev": "vite",
+    "dev": "shopify hydrogen dev",
```
