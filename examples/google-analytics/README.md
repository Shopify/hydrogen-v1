# Google Analytics Example

An example of using [Google Analytics](https://analytics.google.com/analytics/web/) on Hydrogen.

[`/src/components/GoogleAnalytics.client.js`](./src/components/GoogleAnalytics.client.jsx) loads the GA library and subscribes to a `PageView` event.

[Run this example on StackBlitz](https://stackblitz.com/fork/github/shopify/hydrogen/tree/stackblitz/examples/google-analytics)

## Getting started

**Requirements:**

- Node.js version 16.5.0 or higher
- Yarn

```bash
npx degit Shopify/hydrogen/examples/google-analytics hydrogen-app
yarn
yarn dev
```

## Building for production

```bash
yarn build
```

## Previewing a production build

To run a local preview of your Hydrogen app in an environment similar to Oxygen, build your Hydrogen app and then run `yarn preview`:

```bash
yarn build
yarn preview
```
