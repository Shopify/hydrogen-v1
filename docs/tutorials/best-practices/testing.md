---
gid: d194b88a-27c2-4168-b6d7-6a77074f4159
title: Testing best practices for Hydrogen
description: Learn about best practices for testing your Hydrogen storefront.
---

> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.


When testing your Hydrogen storefront, make sure you have accounted for any issues that might occur when customers visit your live storefront.

This guide describes best practices for testing your Hydrogen storefront.

## Running tests

The [Demo Store template](/docs/tutorials/getting-started/templates) contains basic end-to-end (E2E) tests in the [`/tests/e2e`](https://github.com/Shopify/hydrogen/tree/main/templates/demo-store/tests/e2e) folder. The E2E tests are powered by [Vitest](https://vitest.dev) and [Playwright](https://playwright.dev).

You can use the following command to run tests in development:

```bash

yarn test
```



To run tests in a continuous-integration (CI) environment like GitHub Actions, you can use the following command:

```bash

yarn test:ci
```



## Catching common issues

Hydrogen provides an [ESLint plugin](/docs/tutorials/eslint) that enforces Shopify’s JavaScript best practices and catches common issues when using [React Server Components](/docs/tutorials/react-server-components) in Hydrogen apps.

### Hydrogen rules

If you [install the ESLint plugin](/docs/tutorials/eslint#installation) and enable the [Hydrogen configuration](/docs/tutorials/eslint#hydrogen-configuration), then the following Hydrogen rules are included:

| Rule            | Description |
| -------------- | -------- |
| [server-component-banned-hooks](https://github.com/Shopify/hydrogen/tree/main/packages/eslint-plugin/src/rules/server-component-banned-hooks)          | Prevents using the `useState`, `useReducer`, `useEffect`, and `useLayoutEffect` hooks in files that don't end with the `.client` extension      |
| [client-component-banned-hooks](https://github.com/Shopify/hydrogen/tree/main/packages/eslint-plugin/src/rules/client-component-banned-hooks)      | Prevents using the `useQuery` hook in files that end with the `.client` extension      |
| [prefer-image-component](https://github.com/Shopify/hydrogen/tree/main/packages/eslint-plugin/src/rules/prefer-image-component) | Prevents using the `img` tag directly and suggests using the [`Image`](/docs/components/primitive/image) component from `@shopify/hydrogen`     |
| [server-no-json-parse](https://github.com/Shopify/hydrogen/tree/main/packages/eslint-plugin/src/rules/server-no-json-parse) | Prevents using `JSON.parse` in a Hydrogen API route or server component       |
| [prefer-gql](https://github.com/Shopify/hydrogen/tree/main/packages/eslint-plugin/src/rules/prefer-gql) | Detects the use of a GraphQL utility other than the one provided by Hydrogen       |

## Next steps

- Learn about best practices for making your Hydrogen custom storefront [accessible](/docs/tutorials/best-practices/accessibility) and [performant](/docs/tutorials/best-practices/performance).
