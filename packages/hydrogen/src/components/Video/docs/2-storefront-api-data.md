## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [Video object](/api/storefront/latest/objects/video):

```graphql
{
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
