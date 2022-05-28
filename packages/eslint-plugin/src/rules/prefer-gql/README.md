# Prefer using the `gql` utility from Hydrogen

Projects that consume a GraphQL API typically use a utility that parses GraphQL queries into ASTNodes for the projects' GraphQL client library or provides syntax highlighting.

In Hydrogen, you don't need to parse GraphQL queries. Instead, you can use Hydrogen's light-weight [`gql` utility](https://shopify.dev/api/hydrogen/utilities/gql) that adds syntax highlighting to your GraphQL queries.

Using the `gql` utility makes your production bundle smaller by dropping certain AST-related dependencies. In development, however, the `gql` utility uses ASTNodes to provide better errors in your queries.

## Rule details

This rule is used to detect the use of a GraphQL utility other than the one provided by Hydrogen. If another GraphQL utility is being used, then the `gql` utility from `@shopify/hydrogen` is suggested.

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
