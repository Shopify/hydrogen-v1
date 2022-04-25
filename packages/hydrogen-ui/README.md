# Hydrogen-UI

## Getting started

npm:

```bash
npm i --save @shopify/hydrogen-ui
```

Yarn:

```bash
yarn add @shopify/hydrogen-ui
```

Improve the developer experience:

- [Add autocompletion for the Storefront API](#storefront-api-graphql-autocompletion)
- [Add Typescript types for Storefront API objects](#typescript-types)

## Component Types

Hydrogen-UI exposes three different types of components, that match the [React Server Components (RSC)](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#capabilities--constraints-of-server-and-client-components) specification. However, you do not need to be using a RSC-compatible framework in order to use some of these components. Here's a breakdown:

| Import from                   | Works in non-RSC code / frameworks |
| ----------------------------- | ---------------------------------- |
| `@shopify/hydrogen-ui/client` | Yes ✅                             |
| `@shopify/hydrogen-ui/shared` | Yes ✅                             |
| `@shopify/hydrogen-ui/server` | No ❌                              |

When using non-RSC-compatible frameworks, you can view the `/client` and `/shared` import paths as traditional components with essentially no difference between them.

When using RSC-compatible frameworks, then `/client` and `/shared` will have the restrictions as outlined in the RSC doc outlined above.

## Storefront API GraphQL autocompletion

To enable GraphQL autocompletion for the Storefront API in your IDE:

1. Add `graphql` and [GraphQL-config](https://www.graphql-config.com/docs/user/user-installation) by running `yarn add --dev graphql graphql-config`
1. Create a [GraphQL config file](https://www.graphql-config.com/docs/user/user-usage) at the root of your code. For example, `.graphqlrc.yml`
1. Add a [`schema`](https://www.graphql-config.com/docs/user/user-schema) and point it to Hydrogen-UI's bundled schema for the Storefront API. For example:

```yml
# .graphqlrc.yml
schema: node_modules/@shopify/hydrogen-ui/storefront.schema.json
```

GraphQL autocompletion and validation will now work in `.graphql` files or in [`gql`](https://github.com/apollographql/graphql-tag) template literals!

## Typescript Types

To add Typescript types to your Storefront API objects, do the following:

```ts
import type {Product} from '@shopify/hydrogen-ui/storefront-api-types';

const product: Product = {};
```

You may also want to use Typescript's built-in helpers for creating your own object shapes, depending on needs. For example:

```ts
const partialProduct: Partial<Product> = {};

const productTitle: Pick<Product, 'title'> = '';

const productExceptTitle: Omit<Product, 'title'> = {};
```

## Common Problems

### jsx-runtime

If you’re using Vite and not using our Hydrogen plugin, and there is an error that says something like `Uncaught ReferenceError: module is not defined`, it’s likely because of an issue with [Vite and react/jsx-runtime](https://github.com/vitejs/vite/issues/6215).

The solution is to add `'react/jsx-runtime'` to your Vite config's `optimizeDeps.include` array.

### Jest

Until [Jest can correctly resolve package.exports](https://github.com/facebook/jest/issues/9771), here's a workaround:

- Add the [`enhanced-resolve`](https://www.npmjs.com/package/enhanced-resolve) npm package
- Add a new file and copy the code found in the `_export_map_resolver.js` file [here](https://github.com/ceramicnetwork/js-dag-jose/commit/51750b4266bc57ae56af05e0899acf38c519799b#diff-3f698d0dc0e17487612dbe228105aa820683a2eb38343929c1c45d9a8aa479f8)
- Add the `resolver` field to your Jest config, and point it to that file you just created. [Here's](https://github.com/ceramicnetwork/js-dag-jose/commit/51750b4266bc57ae56af05e0899acf38c519799b#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R55) an example
