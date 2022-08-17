---
'@shopify/hydrogen': patch
---

Added a new option `assetHashVersion` to the Hydrogen plugin in `vite.config.js`. This option can be used to manually change the assets file hash.

```js
// vite.config.js
export default {
  plugins: [hydrogen({assetHashVersion: 'v2'})],
};
```
