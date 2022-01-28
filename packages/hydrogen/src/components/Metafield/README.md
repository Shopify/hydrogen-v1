<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/Metafield and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `Metafield` component renders the value of a Storefront
API's [Metafield object](/api/storefront/reference/common-objects/metafield).

When a render function is provided, it passes the Metafield object with a value
that was parsed according to the Metafield's `type` field. For more information,
refer to the [Render props](#render-props) section.

When no render function is provided, it renders a smart default of the
Metafield's `value`. For more information, refer to the [Default Output](#default-output) section.

## Example code

```tsx
import {Metafield} from '@shopify/hydrogen';

export function Product({product}) {
  const metafield = product.metafields.edges.map(({node}) => node)[0];

  return <Metafield metafield={metafield} />;
}

export function ProductWithRenderProp({product}) {
  const metafield = product.metafields.edges.map(({node}) => node)[0];

  return (
    <Metafield metafield={metafield}>
      {(metafield) => {
        return (
          <p>
            {metafield.namespace} {metafield.key}: {metafield.value}
          </p>
        );
      }}
    </Metafield>
  );
}
```

## Props

| Name      | Type                                                  | Description                                                                                                                                           |
| --------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| metafield | <code>ParsedMetafield</code>                          | A [Metafield object](/api/storefront/reference/common-objects/metafield) from the Storefront API.                                                     |
| children? | <code>(value: ParsedMetafield) => ReactElement</code> | A render function that takes a `Metafield` object as an argument. Refer to [Render props](#render-props).                                             |
| as?       | <code>ElementType</code>                              | An HTML tag to be rendered as the base element wrapper. The default value varies depending on [`metafield.type`](/apps/metafields/definitions/types). |

## Default output

When no `children` prop is provided, the `Metafield` component renders the following defaults:

| Metafield `type`         | Output                                                                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `date`                   | A `span` containing the date from [`toLocaleDateString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) with the shop's locale. |
| `date_time`              | A `span` containing the date from [`toLocaleString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString) with the shop's locale.         |
| `boolean`                | A `span` containing "true" or "false" as a string.                                                                                                                                         |
| `number_integer`         | A `span` containing the integer.                                                                                                                                                           |
| `number_decimal`         | A `span` containing the number.                                                                                                                                                            |
| `json`                   | A `span` containing the JSON object as a string.                                                                                                                                           |
| `weight`                 | A `span` containing a string of the localized weight using [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).      |
| `dimension`              | A `span` containing a string of the localized dimension using [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).   |
| `volume`                 | A `span` containing a string of the localized volume using [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).      |
| `rating`                 | A `div` containing filled and unfilled star characters correponding to the rating (for example, ★★★★☆).                                                                                    |
| `color`                  | A `span` containing the color value as a string.                                                                                                                                           |
| `single_line_text_field` | A `RawHtml` component with the text.                                                                                                                                                       |
| `multi_line_text_field`  | A `RawHtml` component with the text.                                                                                                                                                       |
| `product_reference`      | A `span` containing the product reference GID.                                                                                                                                             |
| `file_reference`         | An `Image` component when the file reference is of type `MediaImage`, or a `span` containing the file reference GID for other file types.                                                  |
| `page_reference`         | A `span` containing the page reference GID.                                                                                                                                                |
| `variant_reference`      | A `span` containing the variant reference GID.                                                                                                                                             |
| `url`                    | An `a` tag with the `href` corresponding to the URL and the label corresponding to the URL.                                                                                                |

## Render props

The `Metafield` components provides the Metafield object with a `value` that was parsed according to the `Metafield`'s `type` field. For details on the parsed value, refer to the [`parseMetafieldValue`](/api/hydrogen/utilities/parsemetafieldvalue) utility.

## Component type

The `Metafield` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `MetafieldFragment` or `Metafield.Fragment`. Using this fragment ensures that you have all the data necessary for rendering the `Metafield` component.

```graphql
fragment MetafieldFragment on Metafield {
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
        ...ImageFragment
      }
    }
  }
}
```

### Variables

The `MetafieldFragment` includes variables that you will need to provide values for when performing your query.

| Variable                            | Description                                                                                                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$includeReferenceMetafieldDetails` | A boolean indicating if the reference type should be queried. Only applicable to `file_reference`, `product_reference`, `variant_reference`, and `page_reference` metafield types. |

## Related components

- [`ProductMetafield`](/api/hydrogen/components/product-variant/productmetafield)
