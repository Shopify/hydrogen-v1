# Google Analytics Example

An example of using [Google Analytics](https://analytics.google.com/analytics/web/) on Hydrogen.

[`GoogleAnalytics.client.js`](./src/components/GoogleAnalytics.client.jsx) loads the GA library and subscribes to a `PageView` event.

[Run this example on StackBlitz](https://stackblitz.com/fork/github/shopify/hydrogen/tree/stackblitz/examples/google-analytics)

## Getting started

1. Clone this example.

```bash
npx degit Shopify/hydrogen/examples/google-analytics hydrogen-app
yarn
yarn dev
```

2. Update your `TRACKING_ID` (/src/components/GoogleAnalytics.client.jsx)

3. Open the app in the browser to trigger a `page_view` event.
