---
gid: 232fa7f6-5c17-4659-b8c8-4466be88d602
title: gql
description: The gql literal utility adds syntax highlighting to your GraphQL queries.
---

The `gql` literal utility adds syntax highlighting to your GraphQL queries. You can use `gql` to pass queries to the [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery) hook.

The difference between the `gql` utility and [`graphql-tag`](https://github.com/apollographql/graphql-tag) is that `gql` never parses strings into ASTNodes in production. As a result, it makes the production bundle smaller by dropping certain AST-related dependencies. In development, however, `gql` uses ASTNodes to provide better errors in your queries.

## Example code

```tsx
import {gql} from '@shopify/hydrogen';

const QUERY = gql`
query Localization {
  localization {
    availableCountries {
      name
    }
  }
}`

useShopQuery({
  query: QUERY,
})
```

## Related hooks

- [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery)
