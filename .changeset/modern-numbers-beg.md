---
'@shopify/hydrogen': minor
---

Fix server analytics route

- Fix ServerAnalyticsRoute so that it does complete all async work
- Move Performance and Shopify analytic reporting to client side
- Make sure `ShopifyAnalytics` make its own query for shop id and currency
- Remove query for shop id and currency from `DefaultSeo` component
- Make Performance and Shopify server analytics connector do nothing

### Deprecated components

Remove the following components from `hydrogen.config.js`

- `PerformanceMetricsServerAnalyticsConnector`
- `ShopifyServerAnalyticsConnector`
