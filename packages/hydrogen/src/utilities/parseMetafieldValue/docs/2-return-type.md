## Return type

Depending on the `type` specified in the passed [Metafield](/api/storefront/reference/common-objects/metafield), the following type is returned:

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
