## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `MediaFileFragment` or `MediaFile.Fragment`. Using this fragment ensures that you have all the data necessary for rendering the `MediaFile` component.

```graphql
fragment MediaFileFragment on Media {
  ... on MediaImage {
    mediaContentType
    image {
      ...ImageFragment
    }
  }
  ... on Video {
    mediaContentType
    ...VideoFragment
  }
  ... on ExternalVideo {
    mediaContentType
    ...ExternalVideoFragment
  }
  ... on Model3d {
    mediaContentType
    ...Model3DFragment
  }
}
```
