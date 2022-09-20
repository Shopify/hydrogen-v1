---
'create-hydrogen-app': patch
---

The `sitemap.xml` was crashing when a product didn't contain `featuredImage` in the API data. To replicate the fix in your app, have a look at the latest version of the [`sitemap.xml.server.ts` in our demo store](https://github.com/Shopify/hydrogen/blob/v1.x-2022-07/templates/demo-store/src/routes/sitemap.xml.server.ts).
