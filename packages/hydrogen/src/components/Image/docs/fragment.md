## GraphQL fragment

The following fragment is available as a string for your GraphQL queries using `ImageFragment` or `Image.Fragment`. Using this fragment ensures that you have all the data necessary for rendering the `Image` component.

```graphql
fragment ImageFragment on Image {
  id
  url
  altText
  width
  height
}
```
