## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [Media object](/api/storefront/reference/products/media):

```graphql
{
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
