---
gid: 574c35e8-222f-4e1c-b896-b3763d8c060c
title: flattenConnection
description: The flattenConnection utility transforms a connection object from the Storefront API (for example, Product-related connections) into a flat array of nodes.
---

The `flattenConnection` utility transforms a connection object from the Storefront API (for example, [Product-related connections](https://shopify.dev/api/storefront/reference/products/product)) into a flat array of nodes. The utility works with either `nodes` or `edges.node`.

## Example code

```tsx
import {
  flattenConnection,
  MediaFile,
  useShopQuery,
  MediaFile,
  gql,
} from '@shopify/hydrogen';

const QUERY = gql`
  query product($handle: String!) {
    product: productByHandle(handle: $handle) {
      media(first: 10) {
        edges {
          node {
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
        }
      }
    }
  }
`;
export function Product({handle}) {
  const {data} = useShopQuery({query: QUERY, variables: {handle}});
  const media = flattenConnection(data.product.media);
  return (
    <>
      {media.map((mediaFile) => {
        return <MediaFile data={mediaFile} key={mediaFile.id} />;
      })}
    </>
  );
}
```

## Arguments

| Argument                                                                                                                                          | Required |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| A connection object with the field `nodes` or `edges`. For example, any of the [Product connections](/api/storefront/reference/products/product). | Yes      |

## Return type

A flat array that contains elements that correspond to the `node` value in each element of the original `edges` array, or the `node` itself.

## Related components

- [ProductOptionsProvider](https://shopify.dev/api/hydrogen/components/product-variant/productoptionsprovider)

## Related hooks

- [useProductOptions](https://shopify.dev/api/hydrogen/hooks/product-variant/useproductoptions)
