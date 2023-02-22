# Metafield


The `Metafield` component renders the value of a Storefront
API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield).

The component provides a [default output](/components/primitive/metafield.md#default-output) depending on the metafield type. You can [customize this component](/components#customizing-hydrogen-components) using passthrough props.

## Example code

```tsx
import {Metafield} from '@shopify/hydrogen';

export function Product({product}) {
  const metafield = product.metafield;

  return <Metafield data={metafield} />;
}
```

## Props

| Name | Type                         | Description                                                                                                                                                  |
| ---- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data | `PartialDeep<<wbr>Metafield<wbr>> &#124; null` | An object with fields that correspond to the Storefront API's [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield).     |
| as?  | `TTag`            | An HTML tag to be rendered as the base element wrapper. The default value varies depending on [`metafield.type`](https://shopify.dev/apps/metafields/types). |

## Default output

When no `children` prop is provided, the `Metafield` component renders the following defaults:

| Metafield `type`         | Output                                                                                                                                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `date`                   | A `time` containing the date from [`toLocaleDateString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) with the shop's locale.                |
| `date_time`              | A `time` containing the date from [`toLocaleString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString) with the shop's locale.                        |
| `boolean`                | A `span` containing "true" or "false" as a string.                                                                                                                                                        |
| `number_integer`         | A `span` containing the integer.                                                                                                                                                                          |
| `number_decimal`         | A `span` containing the number.                                                                                                                                                                           |
| `json`                   | A `span` containing the JSON object as a string.                                                                                                                                                          |
| `weight`                 | A `span` containing a string of the localized weight using [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).                     |
| `dimension`              | A `span` containing a string of the localized dimension using [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).                  |
| `volume`                 | A `span` containing a string of the localized volume using [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).                     |
| `rating`                 | A `span` containing a string of the rating value.                                                                                                                                                         |
| `color`                  | A `span` containing the color value as a string.                                                                                                                                                          |
| `single_line_text_field` | A `span` component with the text.                                                                                                                                                                         |
| `multi_line_text_field`  | A `div` component with the lines of text separated by a `<br/>`.                                                                                                                                                         |
| `product_reference`      | A `span` containing the product reference title. If the title doesn't exist, then the GID is displayed.                                                                                                                                                           |
| `file_reference`         | An `Image` component when the file reference is of type `MediaImage`, a `Video` component when the file reference is of type `Video`, an `<a>` linking to the file with a preview image when the file reference is of type `GenericFile`, or a `span` containing the file reference GID when the file is of another type. |
| `page_reference`         | A `span` containing the product reference title. If the title doesn't exist, then the GID is displayed.                                                                                                                                                               |
| `variant_reference`      | A `span` containing the product reference title. If the title doesn't exist, then the GID is displayed.                                                                                                                                                            |
| `url`                    | An `a` tag with the `href` corresponding to the URL and the label corresponding to the URL.                                                                                                               |

## Required fields

The `Metafield` component requires fields from the Storefront API's
[Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield) based on the metafield `type`.

If the metafield `type` is `product_reference`, `variant_reference`, or `page_reference`, then the following fields are required:

```graphql
{
  type
  reference
}
```

For all other metafield `type`s, the following fields are required:

```graphql
{
  type
  value
}
```


## Component type

The `Metafield` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

### Variables

The [Metafield object](https://shopify.dev/api/storefront/reference/common-objects/metafield) includes variables that you will need to provide values for when performing your query.

| Variable                            | Description                                                                                                                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$includeReferenceMetafieldDetails` | A boolean indicating if the reference type should be queried. Only applicable to `file_reference`, `product_reference`, `variant_reference`, and `page_reference` metafield types. |

## Related utilities

- [`parseMetafield`](/utilities/parsemetafield/)
- [`parseMetafieldValue`](/utilities/parsemetafieldvalue/)
