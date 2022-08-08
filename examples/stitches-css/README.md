# Stitches CSS-in-JS x Hydrogen

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts.

- [Check out the docs](https://shopify.dev/custom-storefronts/hydrogen)
- [Run this template on StackBlitz](https://stackblitz.com/github/Shopify/hydrogen/tree/stackblitz/templates/hello-world-js)

Stitches is a CSS-in-JS with near-zero runtime, SSR, multi-variant support, and a best-in-class developer experience.

- [Check out the docs](https://stitches.dev/docs/installation)
- [Check out on github](https://github.com/stitchesjs/stitches)

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher
- Yarn

```bash
npm init @shopify/hydrogen@latest --template hello-world-ts
```

Remember to update `hydrogen.config.js` with your shop's domain and Storefront API token!

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
