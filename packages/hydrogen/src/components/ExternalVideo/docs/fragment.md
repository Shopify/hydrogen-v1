## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `ExternalVideoFragment` or `ExternalVideo.Fragment`. Using this fragment ensures that you have all the data you need for rendering the `ExternalVideo` component.

```graphql
fragment ExternalVideoFragment on ExternalVideo {
  id
  embeddedUrl
  host
}
```
