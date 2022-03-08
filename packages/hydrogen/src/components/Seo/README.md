<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/Seo and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `Seo` component renders SEO information on a webpage.

## Example code

```tsx
import {Seo, useShopQuery} from '@shopify/hydrogen';
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

export default function Page({params}) {
  const {handle} = params;
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

| Type       | Data                                                                                                            | Description                                                                                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| defaultSeo | <pre>{ <br> title: string; <br> description?: string;<br> titleTemplate?: string;<br> lang?: string;<br>}</pre> | The SEO information to render as default on every page of the website. You can specify `homepage`, `product`, `collection`, or `page` in children components to override the default. |
| homepage   | <pre>{ <br> title: string; <br> description?: Description;<br>}</pre>                                           | The SEO information to render on the home page of the website.                                                                                                                        |     |
| product    | The Storefront API [Product](/api/storefront/reference/common-objects/product) object.                          | The SEO information to render on the product page. Must include `title`, `description`, `vendor`, `seo`, at least one variant, and pricing information.                               |
| collection | The Storefront API [Collection](/api/storefront/reference/common-objects/collection) object.                    | The SEO information to render on the collection page. Must include `title`, `description`, and `seo`.                                                                                 |
| page       | <pre>{ <br> title: string; <br> seo: <br> { <br> title?: string; <br> description?: string;<br> }<br>}</pre>    | The SEO information to render on pages (For example, "About" or "Shipping"). Must include `title`, `description`, and `seo`.                                                          |

## Component type

The `Seo` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## GraphQL fragments

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
