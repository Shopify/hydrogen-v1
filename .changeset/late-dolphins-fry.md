---
'create-hydrogen-app': patch
---

Deprecate `@shopify/hydrogen-cli`. Use Shopify CLI (`@shopify/cli-hydrogen` instead.

The template now adds the `@shopify/cli` dependencies for the `yarn preview` command. To update your existing app:

To update your existing apps, install the Shopify & Hydrogen CLIs:

```bash
yarn add -D @shopify/cli @shopify/cli-hydrogen
```

And update the `preview` script in your `package.json`:

```diff
-    "preview": "npx @shopify/hydrogen-cli@latest preview",
+    "preview": "shopify hydrogen preview",
```
