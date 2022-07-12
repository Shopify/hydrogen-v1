# RSC/SSR Hydrogen Cart with session

An example demonstrating a .server driven basic Cart logic.

- Provides a set of cart utilities and cart client
- Provides a `/api/cart/[action]` to handle POST requests from the different `get`, `create`, `add` and `remove` form actions
- Add `cartId` and `cartCount` to the session as cookies so they can be used during .server
- Uses form actions for all interactions with the API. e.g — AddToCart, remove..

# .env

Please add these two your .env
SHOPIFY_STORE_DOMAIN=...
SHOPIFY_STOREFRONT_API_PUBLIC_TOKEN=...

# Hydrogen

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts.

[Check out the docs](https://shopify.dev/custom-storefronts/hydrogen)

[Run this template on StackBlitz](https://stackblitz.com/github/Shopify/hydrogen/tree/stackblitz/templates/hello-world-js)

## Getting started

**Requirements:**

- Node.js version 16.5.0 or higher
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
