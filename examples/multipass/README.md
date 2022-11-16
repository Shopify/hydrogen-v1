# Multipass + Google Sign in

This repo demonstrates how to seamlessly integrate [Shopify Plus](https://www.shopify.com/plus) [multipass](https://shopify.dev/api/multipass) with Hydrogen's customer and checkout [sessions](https://shopify.dev/custom-storefronts/hydrogen/sessions).

Multipass enables you to do the following:

- Persist the customer [session](https://shopify.dev/custom-storefronts/hydrogen/sessions) state between the Hydrogen and checkout experiences, such as staying logged in or out.
- Log in or create a new account automatically, based on an external site's user information.
- Log in or create accounts by leveraging a third-party auth service such as [Google Sign in](https://developers.google.com/identity/gsi/web/guides/overview).

Generate a multipass key (secret) in the [Shopify admin](https://www.shopify.com/admin/settings/checkout)

## Required environment variables

`SHOPIFY_STORE_MULTIPASS_SECRET`=32-characters-multipass-secret
`SHOPIFY_STORE_DOMAIN`=your-store.myshopify.com
`SHOPIFY_CHECKOUT_DOMAIN`=shop.example.com — or same as SHOPIFY_STORE_DOMAIN if a sub-domain is not configured for the checkout
`PUBLIC_GOOGLE_CLIENT_ID`=....googleusercontent.com

## Important files

### routes/

- `/account/login/multipass/` — an api route that handles generation og multipass token
- `/account/login/multipass/:token` — an api route that handles the authentication of multipass tokens

### libs/

- `multipass.ts` — a fetch client that interacts with the local multipass api endpoints
- `multipassify.ts` — a node/v8 friendly [multipassify](https://github.com/beaucoo/multipassify) implementation

### components/

- `CheckoutButtonMultipass` — a multipass-aware checkout button that interacts with the api routes to ensure the hydrogen session state is persisted in the checkout.

---

# Hydrogen

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts.

[Check out the docs](https://shopify.dev/custom-storefronts/hydrogen)

[Run this template on StackBlitz](https://stackblitz.com/github/Shopify/hydrogen/tree/stackblitz/templates/hello-world-ts)

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher
- Yarn

```bash
npm init @shopify/hydrogen@latest --template hello-world-ts
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
