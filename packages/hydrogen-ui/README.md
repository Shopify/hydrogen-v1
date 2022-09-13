# Hydrogen-UI

## NOTICE

⚠️ This is an alpha version of Hydrogen-UI. The name, components, and utilties are all likely to change as we get closer to release. DO NOT USE IN PRODUCTION, THERE WILL BE BREAKING CHANGES. This release is meant for testing. ⚠️

If you still want to test this package, be sure to use the name `@shopify/hydrogen-ui-alpha` instead of `@shopify/hydrogen-ui` in the documentation below.

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

## Versioning

Hydrogen-UI **does not follow semantic versioning**, because the implementation is tied to [specific versions](https://shopify.dev/api/usage/versioning#release-schedule) of the [Shopify Storefront API](https://shopify.dev/api/storefront), which follow [calver](https://calver.org/).

For example, if you are using Storefront API version `2022-07`, then Hydrogen-UI versions `2022.7.x` will all be fully compatible with that version.

As the Storefront API is updated every four months with breaking changes, Hydrogen-UI will also have breaking changes every four months, which are only considered a "minor" version update in semantic versioning.

For example, if you are on Hydrogen-UI version `2022.7.0`, then version `2022.10.0` **is a breaking change**.

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

To help strongly-type your API responses from the Storefront API, you can use the `StorefrontApiResponseOk` and `StorefrontApiResponseError` helpers:

```tsx
import {
  type StorefrontApiResponseError,
  type StorefrontApiResponseOk,
} from '@shopify/hydrogen-ui';

async function FetchApi<DataGeneric>() {
  const apiResponse = await fetch('...');

  if (!apiResponse.ok) {
    // 400 or 500 level error
    return (await apiResponse.text()) as StorefrontApiResponseError; // or apiResponse.json()
  }

  const graphqlResponse: StorefrontApiResponseOk<DataGeneric> =
    await apiResponse.json();

  // can now access 'graphqlResponse.data' and 'graphqlResponse.errors'
}
```

Or if you are using a library that handles 400/500 level errors for you, you can use `StorefrontApiResponse` instead.

To add typing to objects that are trying to match a Storefront API object shape, you can import the shape like the following examples:

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

There are two `umd` builds (development and production) of Hydrogen-UI, meant to be used directly by `<script src=""></script>` tags in HTML, or by `AMD`-compatible loaders.

If you're using Hydrogen-UI as a global through the `<script>` tag, then the components can be accessed through the `hydrogenui` global variable.

## Common Problems

### jsx-runtime

If you’re using Vite and not using our Hydrogen plugin, and there is an error that says something like `Uncaught ReferenceError: module is not defined`, it’s likely because of an issue with [Vite and react/jsx-runtime](https://github.com/vitejs/vite/issues/6215).

The solution is to add `'react/jsx-runtime'` to your Vite config's `optimizeDeps.include` array.

### Jest

Until [Jest can correctly resolve package.exports](https://github.com/facebook/jest/issues/9771), here's a workaround:

- Add the [`enhanced-resolve`](https://www.npmjs.com/package/enhanced-resolve) npm package
- Add a new file and copy the code found in the `_export_map_resolver.js` file [here](https://github.com/ceramicnetwork/js-dag-jose/commit/51750b4266bc57ae56af05e0899acf38c519799b#diff-3f698d0dc0e17487612dbe228105aa820683a2eb38343929c1c45d9a8aa479f8)
- Add the `resolver` field to your Jest config, and point it to that file you just created. [Here's](https://github.com/ceramicnetwork/js-dag-jose/commit/51750b4266bc57ae56af05e0899acf38c519799b#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R55) an example
