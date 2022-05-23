---
gid: 232fa7f6-5c17-4659-b8c8-4466be88d602
title: gql
description: The gql literal utility adds syntax highlight to your GraphQL queries.
---

The `gql` literal utility adds syntax highlight to your GraphQL queries. It can be used to pass queries to `useShopQuery`.

The difference between this utility and [`graphql-tag`](https://github.com/apollographql/graphql-tag) is that the former never parses strings into ASTNodes in production. As a result, it makes the production bundle smaller by dropping certain AST-related dependencies. In development, however, it will use ASTNodes to provide better errors in your queries.

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

## Related framework topics

- [`useShopQuery`](api/hydrogen/hooks/global/useshopquery)
