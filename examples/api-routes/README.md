# API Routes Example

An example of using API routes on Hydrogen.

- [`/src/routes/newsletter.server.jsx`](./src/routes/newsletter.server.jsx) exports an `api` function, enabling POST requests to `/newsletter`.

- [`/src/components/NewsletterForm.client.jsx`](./src/components/NewsletterForm.client.jsx) contains the form which posts the data.

[Run this example on StackBlitz](https://stackblitz.com/fork/github/shopify/hydrogen/tree/stackblitz/examples/api-routes)

## Getting started

**Requirements:**

- Node.js version 16.5.0 or higher
- Yarn

```bash
npx degit Shopify/hydrogen/examples/api-routes hydrogen-app
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
