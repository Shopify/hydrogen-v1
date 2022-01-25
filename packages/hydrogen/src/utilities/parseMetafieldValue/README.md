<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/utilities/parseMetafieldValue and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `parseMetafieldValue` function parses a [Metafield](/api/storefront/reference/common-objects/metafield)'s `value` from a string into a sensible type corresponding to the [Metafield](/api/storefront/reference/common-objects/metafield)'s `type`.

## Example code

```tsx
import {
  parseMetafieldValue,
  Metafield,
  MetafieldFragment,
  flattenConnection,
  useShopQuery,
  Metafield,
} from '@shopify/hydrogen/client';
import gql from 'graphql-tag';

const QUERY = gql`
  query product($handle: String!) {
    product: productByHandle(handle: $handle) {
      metafields(first: 10) {
        edges {
          node {
            ...MetafieldFragment
          }
        }
      }
    }
  }

  ${MetafieldFragment}
`;

export function Product({handle}) {
  const {data} = useShopQuery({query: QUERY, variables: {handle}});

  const metafields = flattenConnection(data.product.metafields);
  const parsedMetafields = metafields.map((metafield) =>
    parseMetafieldValue(metafield)
  );

  return (
    <>
      {parsedMetafields.map((metafield) => {
        return <Metafield metafield={metafield} key={metafield.id} />;
      })}
    </>
  );
}
```

## Arguments

| Description                                                               | Required |
| ------------------------------------------------------------------------- | -------- |
| A [Metafield object](/api/storefront/reference/common-objects/metafield). | Yes      |

## Return type

Depending on the `type` specified in the passed [Metafield](/api/storefront/reference/common-objects/metafield), the following type is returned:

| Metafield `type`         | `value` type                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| `date`                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) |
| `date_time`              | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) |
| `boolean`                | boolean                                                                                       |
| `number_integer`         | int                                                                                           |
| `number_decimal`         | float                                                                                         |
| `json`                   | An object                                                                                     |
| `weight`                 | An object with `value` and `unit` keys                                                        |
| `dimension`              | An object with `value` and `unit` keys                                                        |
| `volume`                 | An object with `value` and `unit` keys                                                        |
| `rating`                 | An object with `scale_min`, `scale_max`, and `value` keys                                     |
| `color`                  | string                                                                                        |
| `single_line_text_field` | string                                                                                        |
| `multi_line_text_field`  | string                                                                                        |
| `product_reference`      | string                                                                                        |
| `file_reference`         | string                                                                                        |
| `page_reference`         | string                                                                                        |
| `variant_reference`      | string                                                                                        |
| `url`                    | string                                                                                        |

## Related hook

- [`useParsedMetafields`](/api/hydrogen/hooks/metafield/useparsedmetafields)
