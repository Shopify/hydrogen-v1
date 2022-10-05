# Hydrogen-UI

## IMPORTANT

⚠️ DO NOT USE IN PRODUCTION. THERE WILL BE BREAKING CHANGES.⚠️

This is an alpha version of Hydrogen-UI. It's only for testing purposes. The name, components, and utilities are all likely to change as we get closer to release.

This document contains the following topics:

- [Versioning](#versioning)
- [Getting started with Hydrogen UI](#getting-started)
- [Authenticating the Storefront API client](#authenticating-the-storefront-client)
- [Development and production bundles](#development-and-production-bundles)
- [Hydrogen UI in the browser](#hydrogen-ui-in-the-browser)
- [Enabling autocompletion for the Storefront API](#enable-storefront-api-graphql-autocompletion)
- [Setting TypeScript types for Storefront API objects](#set-typescript-types)
- [Troubleshooting](#troubleshooting)

## Versioning

**Hydrogen UI doesn't follow semantic versioning**.

Hydrogen UI is tied to specific versions of the [Shopify Storefront API](https://shopify.dev/api/storefront), which follow [calver](https://calver.org/).

For example, if you're using Storefront API version `2022-07`, then Hydrogen UI versions `2022.7.x` are fully compatible.

If the Storefront API version update includes breaking changes, then Hydrogen UI includes breaking changes. Because the API version is updated every three months, breaking changes could occur every three months.

Learn more about API [release schedules](https://shopify.dev/api/usage/versioning#release-schedule) at Shopify.

## Getting started

- Run one of the following commands:

  npm:

  ```bash
  npm i --save @shopify/hydrogen-ui-alpha
  ```

  Yarn:

  ```bash
  yarn add @shopify/hydrogen-ui-alpha
  ```

## Authenticating the Storefront client

To make it easier to query the Storefront API, Hydrogen UI exposes a helper function called `createStorefrontClient()`.

The client can take in the following tokens:

- **[Delegate access](https://shopify.dev/api/usage/authentication#getting-started-with-authenticated-access)**: Used for requests from a server or other private context. Set as `privateStorefrontToken`.

- **[Public](https://shopify.dev/api/usage/authentication#getting-started-with-public-access)**: Used for requests from a browser or other public context. Set as `publicStorefrontToken`.

The following is an example:

```ts
// Filename: '/shopify-client.js'

import {createStorefrontClient} from '@shopify/hydrogen-ui';

const client = createStorefrontClient({
  privateStorefrontToken: '...',
  storeDomain: 'myshop',
  storefrontApiVersion: '2022-07',
});

export const getStorefrontApiUrl = client.getStorefrontApiUrl;
export const getPrivateTokenHeaders = client.getPrivateTokenHeaders;
```

You can then use this in your server-side queries. Here's an example of using it for [NextJS's `getServerSideProps`](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props):

```ts
// Filename: '/pages/index.js'

import {
  getStorefrontApiUrl,
  getPrivateTokenHeaders,
} from '../shopify-client.js';

export async function getServerSideProps() {
  const response = await fetch(getStorefrontApiUrl(), {
    body: GRAPHQL_QUERY,
    headers: getPrivateTokenHeaders({buyerIp: "..."}),
    method: 'POST',
  });

  const json = await response.json();

  return {props: json};
}
```

### Set the content type for the Storefront client

By default, the Storefront client sends the `"content-type": "application/json"` header. You can change this to `application/graphql`.

```ts
createStorefrontClient({contentType: 'graphql', ...})
```

Alternatively, each time you get the headers you can customize which `"content-type"` you want, just for that one invocation:

```ts
getPrivateTokenHeaders({contentType: 'graphql'});
```

**Note:** If you're using TypeScript, then you can [improve the typing experience](#set-typescript-types).

## Development and production bundles

Hydrogen UI has a development bundle and a production bundle. The development bundle has warnings and messages that the production bundle doesn't.

Depending on the bundler or runtime that you're using, the correct bundle might be automatically chosen following the `package.json#exports` of Hydrogen UI. If not, then you might need to configure your bundler / runtime to use the `development` and `production` conditions.

**Note:** The production bundle is used by default if your bundler / runtime doesn't understand the export conditions.

## Hydrogen UI in the browser

Hydrogen UI has a development `umd` build and a production `umd` build. Both are meant to be used directly either by `<script src=""></script>` tags in HTML or by `AMD`-compatible loaders.

If you're using Hydrogen UI as a global through the `<script>` tag, then the components can be accessed through the `hydrogenui` global variable.

## Enable Storefront API GraphQL autocompletion

To improve your development experience, enable GraphQL autocompletion for the Storefront API in your integrated development environment (IDE).

1. Add `graphql` and [GraphQL-config](https://www.graphql-config.com/docs/user/user-installation) with the following command:

   ```bash
   yarn add --dev graphql graphql-config
   ```

1. Create a [GraphQL config file](https://www.graphql-config.com/docs/user/user-usage) at the root of your code. For example, `.graphqlrc.yml`.
1. Add a [`schema`](https://www.graphql-config.com/docs/user/user-schema) and point it to Hydrogen UI's bundled schema for the Storefront API.

   For example:

   ```yml
   # Filename: .graphqlrc.yml
   schema: node_modules/@shopify/hydrogen-ui/storefront.schema.json
   ```

1. Install a GraphQL extension in your IDE, such as the [GraphQL extension for VSCode](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql).

GraphQL autocompletion and validation will now work in `.graphql` files and in [`gql`](https://github.com/apollographql/graphql-tag) template literals!

If you're having trouble getting it to work, then consult our [troubleshooting section](#graphql-autocompletion).

## Set TypeScript types

Improve your development experience by adding strong typing to Storefront API responses. The following are some options for doing this.

### Use the `StorefrontApiResponseError` and `StorefrontApiResponseOk` helpers

The following is an example:

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

  // You can now access 'graphqlResponse.data' and 'graphqlResponse.errors'
}
```

### Use the `StorefrontApiResponse` helper

If you're using a library that handles 400/500 level errors for you, then you can use `StorefrontApiResponse`. To add typing to objects that are trying to match a Storefront API object shape, you can import the shape.

The following is an example:

```ts
import type {Product} from '@shopify/hydrogen-ui/storefront-api-types';

const product: Product = {};
```

### Use TypeScript's helpers

To create your own object shapes, you can use TypeScript's built-in helpers.

The following is an example:

```ts
const partialProduct: Partial<Product> = {};

const productTitle: Pick<Product, 'title'> = '';

const productExceptTitle: Omit<Product, 'title'> = {};
```

## Troubleshooting

The following will help you troubleshoot common problems in this version of Hydrogen UI.

### GraphQL autocompletion

If you can't get [GraphQL autocompletion](<(#storefront-api-graphql-autocompletion)>) to work, then try restarting the GraphQL server in your IDE.

For example, in VSCode do the following:

1. Open the [command palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
1. Type `graphql`.
1. Select `VSCode GraphQL: Manual Restart`.

<!--- commenting out as this might have been fixed: https://github.com/Shopify/hydrogen/pull/2186/files#r978104641
### jsx-runtime

If you’re using Vite and not using our Hydrogen plugin, and you see an error like `Uncaught ReferenceError: module is not defined`, then it’s likely because of an issue with [Vite and react/jsx-runtime](https://github.com/vitejs/vite/issues/6215).

- Add `'react/jsx-runtime'` to your Vite config's `optimizeDeps.include` array.
--->
