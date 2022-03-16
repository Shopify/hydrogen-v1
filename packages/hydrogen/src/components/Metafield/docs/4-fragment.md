## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `MetafieldFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `Metafield` component.

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
  reference @include(if: $includeReferenceMetafieldDetails) {
    __typename
    ... on MediaImage {
      id
      mediaContentType
      image {
        id
        url
        altText
        width
        height
      }
    }
  }
}
```

### Variables

The `MetafieldFragment` includes variables that you will need to provide values for when performing your query.

| Variable                            | Description                                                                                                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$includeReferenceMetafieldDetails` | A boolean indicating if the reference type should be queried. Only applicable to `file_reference`, `product_reference`, `variant_reference`, and `page_reference` metafield types. |
