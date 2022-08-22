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
- [Add TypeScript types for Storefront API objects](#typescript-types)

## Storefront API GraphQL autocompletion

To enable GraphQL autocompletion for the Storefront API in your IDE:

1. Add `graphql` and [GraphQL-config](https://www.graphql-config.com/docs/user/user-installation) by running `yarn add --dev graphql graphql-config`
2. Create a [GraphQL config file](https://www.graphql-config.com/docs/user/user-usage) at the root of your code. For example, `.graphqlrc.yml`
3. Add a [`schema`](https://www.graphql-config.com/docs/user/user-schema) and point it to Hydrogen-UI's bundled schema for the Storefront API. For example:

```yml
# .graphqlrc.yml
schema: node_modules/@shopify/hydrogen-ui/storefront.schema.json
```

4. Install a GraphQL extension in your IDE; for example, the [GraphQL extension for VSCode](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql)

GraphQL autocompletion and validation will now work in `.graphql` files or in [`gql`](https://github.com/apollographql/graphql-tag) template literals!

## TypeScript Types

To add TypeScript types to your Storefront API objects, do the following:

```ts
import type {Product} from '@shopify/hydrogen-ui/storefront-api-types';

const product: Product = {};
```

You may also want to use TypeScript's built-in helpers for creating your own object shapes, depending on needs. For example:

```ts
const partialProduct: Partial<Product> = {};

const productTitle: Pick<Product, 'title'> = '';

const productExceptTitle: Omit<Product, 'title'> = {};
```

## Development and Production bundles

Hydrogen-UI has a development and production bundle; the development bundle has additional warnings and messages that the production bundle does not have.

Depending on the bundler or runtime you're using, it may automatically choose the correct bundle by following the `package.json#exports` of Hydrogen-UI. If it's not automatic, then you may need to configure your bundler / runtime to use the `development` and `production` conditions to enable this feature.

The production bundle is used by default if your bundler / runtime doesn't understand the export conditions.

## Hydrogen-UI in the Browser

There is also a `umd` build of Hydrogen-UI, meant to be used directly by `<script src=""></script>` tags in HTML, or by `AMD`-compatible loaders. There is also a production and development build version of the `umd` bundle.

If you're using Hydrogen-UI as a global (through the `<script>` tag), then the components can be accessed through the `hydrogenui` global variable.

## Working on Hydrogen-UI

There are two ways you can develop Hydrogen-UI components:

- Develop components in the demo store:
  1. Add `"@shopify/hydrogen-ui": "2022.07.0"` to the demo-store's `package.json`
  2. Run `yarn` then `yarn dev` in the demo-store directory,
  3. Run `yarn dev:demo` in the hydrogen-ui directory
- Develop components in isolation:
  1. Run `yarn dev` (or `yarn dev:story`) in the hydrogen-ui directory to spin up an instance of [Ladle](https://ladle.dev/)
  2. Edit the component or the component's story `[ComponentName].stories.tsx`

## Common Problems

### jsx-runtime

If you’re using Vite and not using our Hydrogen plugin, and there is an error that says something like `Uncaught ReferenceError: module is not defined`, it’s likely because of an issue with [Vite and react/jsx-runtime](https://github.com/vitejs/vite/issues/6215).

The solution is to add `'react/jsx-runtime'` to your Vite config's `optimizeDeps.include` array.

### Jest

Until [Jest can correctly resolve package.exports](https://github.com/facebook/jest/issues/9771), here's a workaround:

- Add the [`enhanced-resolve`](https://www.npmjs.com/package/enhanced-resolve) npm package
- Add a new file and copy the code found in the `_export_map_resolver.js` file [here](https://github.com/ceramicnetwork/js-dag-jose/commit/51750b4266bc57ae56af05e0899acf38c519799b#diff-3f698d0dc0e17487612dbe228105aa820683a2eb38343929c1c45d9a8aa479f8)
- Add the `resolver` field to your Jest config, and point it to that file you just created. [Here's](https://github.com/ceramicnetwork/js-dag-jose/commit/51750b4266bc57ae56af05e0899acf38c519799b#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R55) an example
