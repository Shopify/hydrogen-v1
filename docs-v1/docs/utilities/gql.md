# gql


The `gql` literal utility adds syntax highlighting to your GraphQL queries. You can use `gql` to pass queries to the [`useShopQuery`](/hooks/global/useshopquery/) hook.

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

- [`useShopQuery`](/hooks/global/useshopquery/)
