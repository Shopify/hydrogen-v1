# Prefer using the `gql` utility from Hydrogen

Projects that consume a GraphQL API typically use a utility to parses GraphQL queries into an AST for the projects' GraphQL client library to use. It will also often provide syntax highlighting, auto-completion and other integrations with the developers editor.

In Hydrogen, you don't need to parse GraphQL queries into an AST and can cut down on the projects' final bundle size by using Hydrogen's light-weight [`gql` utility](https://shopify.dev/api/hydrogen/utilities/gql) instead.

Using the `gql` utility makes your production bundle smaller by dropping certain AST-related dependencies. In development, however, the `gql` utility uses ASTNodes to provide better errors in your queries.

## Rule details

This rule is used to detect the use of a GraphQL utility other than the one provided by Hydrogen. If another GraphQL utility is used, then the `gql` utility from `@shopify/hydrogen` is suggested. This will also replace the utility automatically when `eslint` is run with the `--fix` flag if you choose.

### Incorrect code

```tsx
import {gql} from 'graphql-tag';

function MyComponent() {
  const query = gql`
    //...
  `
  return (
    //...
  );
}
```

### Correct code

```tsx
import {gql} from '@shopify/hydrogen';

function MyComponent() {
  const query = gql`
    //...
  `
  return (
    //...
  );
}
```
