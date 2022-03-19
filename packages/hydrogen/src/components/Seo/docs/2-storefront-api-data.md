## Storefront API data

The `Seo` component includes the following types that expect a specific data shape:

### `defaultSeo`

The `defaultSeo` type is an object with the following data structure. The `title` and `description` fields correspond to the Storefront API's [Seo object](/api/storefront/latest/objects/seo):

```graphql
{
  title: name
  description
  titleTemplate?: string
  lang?: string
}
```

### `homepage`

The `homepage` type is an object with fields that correspond to the Storefront API's [Seo object](/api/storefront/latest/objects/seo):

```graphql
{
  title: name
  description
}
```

### `product`

The `product` type is an object with fields that correspond to the Storefront API's [Product object](/api/storefront/latest/objects/product):

```graphql
{
  title
  description
  seo {
    title
    description
  }
  vendor
  featuredImage {
    id
    url
    altText
    width
    height
  }
  variants(first: $numProductVariants) {
    edges {
      node {
        image {
          url
        }
        availableForSale
        priceV2 {
          amount
          currencyCode
        }
        sku
      }
    }
  }
}
```

### `collection`

The `collection` type is an object with fields that correspond to the Storefront API's [Collection object](/api/storefront/latest/objects/collection):

```graphql
{
  title
  description
  seo {
    title
    description
  }
  image {
    id
    url
    altText
    width
    height
  }
}
```

### `page`

The `page` type is an object with fields that correspond to the Storefront API's [Page object](/api/storefront/latest/objects/page):

```graphql
{
  title
  seo {
    title
    description
  }
}
```
