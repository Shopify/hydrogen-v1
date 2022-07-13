# RSC/SSR Hydrogen Cart with session

A hydrogen example demonstrating a 💯 `.server-driven` basic Cart workflow.

- Provides a set of `cart` utilities (`getCart`, `createCart`...) as well as a GraphQL cart client
- Provides a `/api/cart/[action]` that handle POST requests from the different `get`, `create`, `add` and `remove` form actions.
- Persists `cartId` and `cartCount` to the session (cookie), so they can be used used during the `.server` lifecycle
- Uses form actions for all interactions with the API. e.g — AddToCart, remove..
- Provides `suspendedFn` a utility to enable `<Suspend />` friendly async API calls from `.server` components

### Additional context

[Oxygen Demo](https://hello-server-cart-596cadc157f9402f1570.o2.myshopify.dev/)

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
