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
