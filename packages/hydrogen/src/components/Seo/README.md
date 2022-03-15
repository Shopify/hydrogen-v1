<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/Seo and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `Seo` component renders SEO information on a webpage.

## Example code

```tsx
import {Seo, useShopQuery, useRouteParams} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  query PageDetails($handle: String!) {
    page(handle: $handle) {
      title
      body
      seo {
        title
        description
      }
    }
  }
`;

export default function Page() {
  const {handle} = useRouteParams();
  const {data} = useShopQuery({query: QUERY, variables: {handle}});

  if (!data.pageByHandle) {
    return <NotFound />;
  }

  const page = data.pageByHandle;

  return <Seo type="page" data={page} />;
}
```

## Props

The `Seo` component has two props: `type` and `data`. The `type` prop accepts `defaultSeo`, `homepage`, `product`, `collection`, or `page`. Each `type` expects a different `data` shape.

| Type       | Data                         | Description                                                                                                                                                                                                                                                                 |
| ---------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultSeo | [Structure](#defaultseo)     | The SEO information to render as default on every page of the website. Corresponds to the Storefront API's [Seo object](/api/storefront/latest/objects/seo). You can specify `homepage`, `product`, `collection`, or `page` in children components to override the default. |
| homepage   | [Structure](#homepage)       | The SEO information to render on the home page of the website. Corresponds to the Storefront API's [Seo object](/api/storefront/latest/objects/seo).                                                                                                                        |
| product    | [GraphQL query](#product)    | The SEO information to render on the product page. Corresponds to the Storefront API's [Product object](/api/storefront/latest/objects/product).                                                                                                                            |
| collection | [GraphQL query](#collection) | The SEO information to render on the collection page. Corresponds to the Storefront API's [Collection object](/api/storefront/latest/objects/collection).                                                                                                                   |
| page       | [GraphQL query](#page)       | The SEO information to render on pages (for example, "About" or "Shipping"). Corresponds to the Storefront API's [Page object](/api/storefront/latest/objects/page).                                                                                                        |

## Component type

The `Seo` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

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
