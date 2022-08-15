# Partytown + GTM + Hydrogen

This example demonstrates how to load 3rd party libraries using Web Workers via [Partytown](https://partytown.builder.io/).

Workers/Web Workers/Partytown require [@shopify/hydrogen@^1.1.0](https://github.com/Shopify/hydrogen/releases/tag/%40shopify%2Fhydrogen%401.1.0)

To debug, please see console logs and inspect `<head />` for the partytown scripts.

Please add these env variables to your `/.env` and hosting platform (production):

```
GTM_ID=GTM-XYZABC0
GA4_ID=G-12345ABCDE
SHOPIFY_STORE_DOMAIN=
SHOPIFY_STOREFRONT_API_PUBLIC_TOKEN=
```

### Included in this example:

- `/components/GTM.server` — to initialize the `dataLayer` and load the `https://www.googletagmanager.com/gtm.js` script via partytown
- `/route/reverse-proxy` — an api that helps us bypass CORS issues when loading 3rd-party libraries via partytown Web Workers.
- `/components/PageViewEvent` — a client component demonstrating how to trigger `page_view` and `container initialized` gtm events.
- `App.jsx` — includes the `<Partytown />` instance and `enablePartytownAtomic` a helper function to enable partytown in atomic mode
- `yarn partytown` — a script to copy partytown worker scripts to `/public/~partytown`. (To be run after a `@builder.io/partytown` update)

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
