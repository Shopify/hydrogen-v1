<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/utilities/flattenConnection and run 'yarn generate-docs' at the root of this repo. -->

The `flattenConnection` utility transforms a connection object from the Storefront API (for example, [Product-related connections](api/storefront/reference/products/product#connections)) into a flat array of nodes.

## Arguments

| Description                                                                                                                                                                                                          | Required |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| A connection object with the field `edges` whose value is an array of objects corresponding to `{node: Value}`. For example, any of the [Product connections](api/storefront/reference/products/product#connections) | Yes      |

## Return type

A flat array whose elements correspond to the `node` value in each element of the original `edges` array.

## Example code

```tsx
import {
  MediaFileFragment,
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
            ...MediaFileFragment
          }
        }
      }
    }
  }
  ${MediaFileFragment}
`;
export function Product({handle}) {
  const {data} = useShopQuery({query: QUERY, variables: {handle}});
  const media = flattenConnection(data.product.media);
  return (
    <>
      {media.map((mediaFile) => {
        return <MediaFile media={mediaFile} key={mediaFile.id} />;
      })}
    </>
  );
}
```

## Related components

- [ProductProvider](api/hydrogen/components/product-variant/productprovider)

## Related hooks

- [useProduct](api/hydrogen/hooks/product-variant/useproduct)
