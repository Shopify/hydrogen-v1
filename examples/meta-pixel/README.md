# Meta Pixel Example

An example of using [Meta Pixel](https://developers.facebook.com/docs/meta-pixel) on Hydrogen.

[`/src/components/MetaPixel.client.js`](./src/components/MetaPixel.client.jsx) loads the Meta Pixel library and subscribes to a `PageView` event.

[Run this example on StackBlitz](https://stackblitz.com/fork/github/shopify/hydrogen/tree/stackblitz/examples/meta-pixel)

## Getting started

**Requirements:**

- Node.js version 16.5.0 or higher
- Yarn

```bash
npx degit Shopify/hydrogen/examples/meta-pixel hydrogen-app
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
