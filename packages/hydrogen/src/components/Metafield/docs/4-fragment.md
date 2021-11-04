## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `MetafieldFragment` or `Metafield.Fragment`. Using this fragment ensures that you have all the data necessary for rendering the `Metafield` component.

```graphql
fragment MetafieldFragment on Metafield {
  id
  type
  namespace
  key
  value
  createdAt
  updatedAt
  description
}
```
