# parseMetafieldValue


The `parseMetafieldValue` function parses a [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `value` from a string into a sensible type corresponding to the [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `type`.

## Example code

```tsx
import {
  parseMetafieldValue,
  Metafield,
  flattenConnection,
  useShopQuery,
  Metafield,
  gql,
} from '@shopify/hydrogen';

const QUERY = gql`
  query product($handle: String!) {
    product: productByHandle(handle: $handle) {
      metafield(namespace: "my_namespace", key: "my_key") {
        id
        type
        namespace
        key
        value
        createdAt
        updatedAt
        description
        reference @include(if: $includeReferenceMetafieldDetails) {
          __typename
          ... on MediaImage {
            id
            mediaContentType
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

export function Product({handle}) {
  const {data} = useShopQuery({query: QUERY, variables: {handle}});

  const metafieldValue = parseMetafieldValue(data.product.metafield)

  return (
    <div>
      {metafieldValue}
    </div>
  );
}
```

## Arguments

| Argument                                                                                     | Required |
| -------------------------------------------------------------------------------------------- | -------- |
| A [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield). | Yes      |

## Return type

Depending on the `type` specified in the passed [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield), the following type is returned:

| Metafield `type`         | `value` type                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| `date`                   | [date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) |
| `date_time`              | [date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) |
| `boolean`                | Boolean                                                                                       |
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

## Related components

- [`Metafield`](/components/primitive/metafield/)

## Related utilities

- [`parseMetafield`](/utilities/parsemetafield/)
