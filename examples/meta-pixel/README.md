# Meta Pixel Example

An example of using [Meta Pixel](https://developers.facebook.com/docs/meta-pixel) on Hydrogen.

[`MetaPixel.client.js`](./src/components/MetaPixel.client.jsx) loads the Meta Pixel library and subscribes to a `PageView` event.

[Run this example on StackBlitz](https://stackblitz.com/fork/github/shopify/hydrogen/tree/stackblitz/examples/meta-pixel)

## Getting started

1. Clone this example.

```bash
npx degit Shopify/hydrogen/examples/meta-pixel hydrogen-app
yarn
yarn dev
```

2. Update your `PIXEL_ID` (/src/components/MetaPixel.client.jsx)

3. Open the app in the browser to trigger a `PageView` event.
