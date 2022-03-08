## GraphQL fragments

The `Seo` component supports the following fragments which correspond to each type:

### `defaultSeo`

The following fragment is available as a string for your GraphQL query using `DefaultPageSeoFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `<Seo type="defaultSeo" />` component.

```graphql
fragment DefaultPageSeoFragment on Shop {
  title: name
  description
}
```

### `homepage`

The following fragment is available as a string for your GraphQL query using `HomeSeoFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `<Seo type="homepage" />` component.

```graphql
fragment HomeSeoFragment on Shop {
  title: name
  description
}
```

### `product`

The following fragment is available as a string for your GraphQL query using `ProductSeoFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `<Seo type="product" />` component.

```graphql
fragment ProductSeoFragment on Product {
  title
  description
  seo {
    ...SeoFragment
  }
  vendor
  featuredImage {
    ...ImageSeoFragment
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

The following fragment is available as a string for your GraphQL query using `CollectionSeoFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `<Seo type="collection" />` component.

```graphql
fragment CollectionSeoFragment on Collection {
  title
  description
  seo {
    ...SeoFragment
  }
  image {
    ...ImageSeoFragment
  }
}
```

### `page`

The following fragment is available as a string for your GraphQL query using `PageSeoFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `<Seo type="page" />` component.

```graphql
fragment PageSeoFragment on Page {
  title
  seo {
    ...SeoFragment
  }
}
```
