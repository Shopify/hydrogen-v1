---
'@shopify/hydrogen': minor
---

Remove `defaultLocale` from the Hydrogen Config and instead add `defaultCountryCode` and `defaultLanguageCode`. Both of which are also now available by the `useShop()` hook:

```diff
export default defineConfig({
  shopify: {
-    defaultLocale: 'EN-US',
+    defaultCountryCode: 'US',
+    defaultLanguageCode: 'EN',
    storeDomain: 'hydrogen-preview.myshopify.com',
    storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
    storefrontApiVersion: '2022-07',
  },
}
```
