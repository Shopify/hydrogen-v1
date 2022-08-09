# Hydrogen x react-i18n

![i18n-example](https://user-images.githubusercontent.com/12080141/176053657-a797c545-f170-4631-b979-479671e967ea.gif)

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts.

- [Check out the docs](https://shopify.dev/custom-storefronts/hydrogen)
- [Run this template on StackBlitz](https://stackblitz.com/github/Shopify/hydrogen/tree/stackblitz/templates/hello-world-js)

react-i18next is a powerful internationalization framework for React / React Native which is based on i18next. Check out the history of i18next and when react-i18next was introduced.

- [Checkout docs](https://react.i18next.com/)
- [Checkout on github](https://github.com/i18next/react-i18next)

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
