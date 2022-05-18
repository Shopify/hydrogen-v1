---
gid: 1e35ff3e-fafe-11eb-9a03-0242ac175349
title: Seo
description: The Seo component renders SEO information on a webpage.
---

The `Seo` component renders SEO information on a webpage.

## Example code

```tsx
import {Seo, useShopQuery, useRouteParams, gql} from '@shopify/hydrogen';

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

The `Seo` component has two props: `type` and `data`. The `type` prop accepts `defaultSeo`, `homepage`, `product`, `collection`, `page`, or `noindex`. Each `type` expects a different `data` shape.

| Type       | Data                                                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultSeo | <code>Omit&#60;DefaultPageType, 'url'&#62;</code>                               | The SEO information to render as default on every page of the website. This includes the defaults for title, description, and title template. <br></br>The title template defaults to the pattern of `%s - ${data.title}`, where `%s` is the title of children components. You can [overwrite this pattern](https://shopify.dev/custom-storefronts/hydrogen/framework/seo#overwriting-title-template) using the `data.titleTemplate` prop. <br></br>The language defaults to the `defaultLocale` value provided in `hydrogen.config.js` or `EN-US` when not specified. |
| homepage   | <code>Omit&#60;HomePageType, 'url'&#62;</code>                                  | The SEO information to render on the home page of the website. Corresponds to the Storefront API's [Seo object](https://shopify.dev/api/storefront/latest/objects/seo).                                                                                                                                                                                                                                                                                                                                                                                                |
| product    | <code>Omit&#60;ComponentProps&#60;typeof ProductSeo&#62;, 'url'&#62;</code>     | The SEO information to render on the product page. Corresponds to the Storefront API's [Product object](https://shopify.dev/api/storefront/latest/objects/product).                                                                                                                                                                                                                                                                                                                                                                                                    |
| collection | <code>Omit&#60;ComponentProps&#60;typeof CollectionSeo&#62;, 'url'&#62;</code>  | The SEO information to render on the collection page. Corresponds to the Storefront API's [Collection object](https://shopify.dev/api/storefront/latest/objects/collection).                                                                                                                                                                                                                                                                                                                                                                                           |
| page       | <code>Omit&#60;ComponentProps&#60;typeof PageSeo&#62;, 'url'&#62;</code>        | The SEO information to render on pages (for example, "About" or "Shipping"). Corresponds to the Storefront API's [Page object](https://shopify.dev/api/storefront/latest/objects/page).                                                                                                                                                                                                                                                                                                                                                                                |
| noindex    | <code>Omit&#60;ComponentProps&#60;typeof NoIndexPageSeo&#62;, 'url'&#62;</code> | Instructs bots to not index a page (for example, an authenticated account management page).                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Component type

The `Seo` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Storefront API data

The `Seo` component includes the following types that expect a specific data shape:

### `defaultSeo`

The `defaultSeo` type is an object with the following data structure. The `title` and `description` fields correspond to the Storefront API's [Seo object](https://shopify.dev/api/storefront/latest/objects/seo):

```graphql
{
  title: name
  description
  titleTemplate?: string
  lang?: string
}
```

### `homepage`

The `homepage` type is an object with fields that correspond to the Storefront API's [Seo object](https://shopify.dev/api/storefront/latest/objects/seo):

```graphql
{
  title: name
  description
}
```

### `product`

The `product` type is an object with fields that correspond to the Storefront API's [Product object](https://shopify.dev/api/storefront/latest/objects/product):

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

The `collection` type is an object with fields that correspond to the Storefront API's [Collection object](https://shopify.dev/api/storefront/latest/objects/collection):

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

The `page` type is an object with fields that correspond to the Storefront API's [Page object](https://shopify.dev/api/storefront/latest/objects/page):

```graphql
{
  title
  seo {
    title
    description
  }
}
```

### `noindex`

The `noindex` type provides data for a page, but instructs bots to not index the page.

```graphql
{
  title: name
  titleTemplate?: string
  lang?: string
}
```

## Related framework topics

- [SEO](https://shopify.dev/custom-storefronts/hydrogen/framework/seo)