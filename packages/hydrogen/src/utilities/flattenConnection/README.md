<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/utilities/flattenConnection and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `flattenConnection` utility transforms a connection object from the Storefront API (for example, [Product-related connections](/api/storefront/reference/products/product)) into a flat array of nodes.

## Example code

```tsx
import {
  flattenConnection,
  MediaFile,
  useShopQuery,
  MediaFile,
} from '@shopify/hydrogen/client';
import gql from 'graphql-tag';

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

| Description                                                                                                                                                                                               | Required |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| A connection object with the field `edges` whose value is an array of objects corresponding to `{node: Value}`. For example, any of the [Product connections](/api/storefront/reference/products/product) | Yes      |

## Return type

A flat array whose elements correspond to the `node` value in each element of the original `edges` array.

## Related components

- [ProductProvider](api/hydrogen/components/product-variant/productprovider)

## Related hooks

- [useProduct](api/hydrogen/hooks/product-variant/useproduct)
