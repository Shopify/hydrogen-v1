## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `MediaFileFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `MediaFile` component.

```graphql
fragment MediaFileFragment on Media {
  ... on MediaImage {
    mediaContentType
    image {
      id
      url
      altText
      width
      height
    }
  }
  ... on Video {
    mediaContentType
    id
    previewImage {
      url
    }
    sources {
      mimeType
      url
    }
  }
  ... on ExternalVideo {
    mediaContentType
    id
    embedUrl
    host
  }
  ... on Model3d {
    mediaContentType
    id
    alt
    mediaContentType
    previewImage {
      url
    }
    sources {
      url
    }
  }
}
```
