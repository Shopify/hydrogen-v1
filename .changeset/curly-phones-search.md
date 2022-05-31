---
'@shopify/hydrogen': minor
'template-hydrogen-default': minor
---

- Fix clientAnalytics not waiting for all server analytics data before sending page view event
- Fix server analytics connector erroring out after more than 1 server analytics connectors are attached
- Shopify analytics components

# Updates to server analytics connectors

The server analytics connector interface has updated to

```jsx
export function request(
  requestUrl: string,
  requestHeader: Headers,
  data?: any,
  contentType?: string
): void {
  // Do something with the analytic event
}
```

# Introducing Shopify analytics

Optional analytics components that allows you to send ecommerce related analytics to
Shopify. Adding the Shopify analytics components will allow the Shopify admin - Analytics
dashboard to work.

For information, see [Shopify Analytics](https://shopify.dev/custom-storefronts/hydrogen/componenets/framework/shopifyanalytics)
