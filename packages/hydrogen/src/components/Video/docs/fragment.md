## GraphQL fragment

The following fragment is available as a string for your GraphQL queries using `VideoFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `Video` component.

```graphql
fragment VideoFragment on Video {
  id
  previewImage {
    url
  }
  sources {
    mimeType
    url
  }
}
```
