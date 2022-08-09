# CSS Modules Example

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts.

[Check out the docs](https://shopify.dev/custom-storefronts/hydrogen)

[Run this example on StackBlitz](https://stackblitz.com/fork/github/shopify/hydrogen/tree/stackblitz/examples/css-modules)

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher
- Yarn

```bash
npx degit Shopify/hydrogen/examples/css-modules hydrogen-app
yarn
yarn dev
```

Remember to update `hydrogen.config.ts` with your shop's domain and Storefront API token!

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
