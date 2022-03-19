## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [Metafield object](/api/storefront/reference/common-objects/metafield):

```graphql
{
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

The [Metafield object](/api/storefront/reference/common-objects/metafield) includes variables that you will need to provide values for when performing your query.

| Variable                            | Description                                                                                                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$includeReferenceMetafieldDetails` | A boolean indicating if the reference type should be queried. Only applicable to `file_reference`, `product_reference`, `variant_reference`, and `page_reference` metafield types. |
