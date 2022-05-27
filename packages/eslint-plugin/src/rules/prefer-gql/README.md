# Prefer using the `gql` utility from hydrogen

Projects that consume a GraphQL API will often use utility to help write GraphQL queries to parse the queries into an AST for the project's GraphQL client library and/or provide syntax highlighting. In hydrogen, we do not require to parse the GraphQL queries and provide a lightweight `gql` utility that is optimized for use within Hydrogen projects.

## Rule details

This rule is used to detect usages of `gql` utility other than the one provided by Hydrogen and suggests the utility from `@shopify/hydrogen`instead.

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
