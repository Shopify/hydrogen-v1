# Sanity.io + TypeScript Example

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts. [Sanity.io](https://www.sanity.io) is a platform for structured content. You can use it to drive content for any frontend or application. You can use Sanity together with Shopify and Hydrogen to make content-driven custom storefronts.

This is a _minimal example_ of how you can connect Hydrogen with your Shopify store and your Sanity project. It assumes that you've used the [Sanity connect](https://apps.shopify.com/sanity-connect) on the Shopify marketplace. It syncs product data to Sanity in a way that lets you integrate product information with content.

For a real-world custom example using Shopify, Hydrogen and Sanity, [check out the AKVA demo storefront](https://snty.link/shopify-demo).

[Check out the Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)

[Run this example on StackBlitz](https://stackblitz.com/fork/github/shopify/hydrogen/tree/stackblitz/examples/sanity)

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher
- Yarn

```bash
npx degit Shopify/hydrogen/examples/sanity hydrogen-app
cd hydrogen-app
yarn
yarn dev
```

Remember to:

- update `hydrogen.config.ts` with your shop's domain and Storefront API token!
- update `sanity.config.ts` with your Sanity project ID and dataset name.

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
