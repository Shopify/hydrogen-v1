## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `Model3DFragment` or `Model3D.Fragment`. Using this fragment ensures that you have all the data necessary for rendering the `Model3D` component.

```graphql
fragment Model3DFragment on Model3d {
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
```
