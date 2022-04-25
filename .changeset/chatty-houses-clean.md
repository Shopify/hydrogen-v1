---
'create-hydrogen-app': patch
---

Fix issue where preview won't start without experimental-vm-modules flag. Update your package.json:

```diff
  "scripts": {
    "dev": "shopify hydrogen dev",
    "lint": "npm-run-all lint:*",
    "lint:js": "eslint --no-error-on-unmatched-pattern --ext .js,.ts,.jsx,.tsx src",
    "lint:css": "stylelint ./src/**/*.{css,sass,scss}",
    "build": "yarn build:client && yarn build:server && yarn build:worker",
    "build:client": "vite build --outDir dist/client --manifest",
    "build:server": "vite build --outDir dist/server --ssr @shopify/hydrogen/platforms/node",
    "build:worker": "cross-env WORKER=true vite build --outDir dist/worker --ssr @shopify/hydrogen/platforms/worker",
    "serve": "node --enable-source-maps dist/server",
    "test": "WATCH=true vitest",
    "test:ci": "yarn build && vitest run",
-    "preview": "shopify hydrogen preview"
+    "preview": "node --experimental-vm-modules node_modules/.bin/shopify hydrogen preview"
  },
```
