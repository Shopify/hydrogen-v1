import {RawMetafield} from '../../types';

/**
 * The `parseMetafieldValue` function parses a [Metafield](/api/storefront/reference/common-objects/metafield)'s `value` from a string into a sensible type corresponding to the [Metafield](/api/storefront/reference/common-objects/metafield)'s `type`.
 *
 * ## Arguments
 *
 * | Description                                                               | Required |
 * | ------------------------------------------------------------------------- | -------- |
 * | A [Metafield object](/api/storefront/reference/common-objects/metafield). | Yes      |
 *
 * ## Return type
 *
 * Depending on the `type` specified in the passed [Metafield](/api/storefront/reference/common-objects/metafield), the following type is returned:
 *
 * | Metafield `type`         | `value` type                                                                                  |
 * | ------------------------ | --------------------------------------------------------------------------------------------- |
 * | `date`                   | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) |
 * | `date_time`              | [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) |
 * | `boolean`                | boolean                                                                                       |
 * | `number_integer`         | int                                                                                           |
 * | `number_decimal`         | float                                                                                         |
 * | `json`                   | An object                                                                                     |
 * | `weight`                 | An object with `value` and `unit` keys                                                        |
 * | `dimension`              | An object with `value` and `unit` keys                                                        |
 * | `volume`                 | An object with `value` and `unit` keys                                                        |
 * | `rating`                 | An object with `scale_min`, `scale_max`, and `value` keys                                     |
 * | `color`                  | string                                                                                        |
 * | `single_line_text_field` | string                                                                                        |
 * | `multi_line_text_field`  | string                                                                                        |
 * | `product_reference`      | string                                                                                        |
 * | `file_reference`         | string                                                                                        |
 * | `page_reference`         | string                                                                                        |
 * | `variant_reference`      | string                                                                                        |
 * | `url`                    | string                                                                                        |
 */
export function parseMetafieldValue(metafield: Partial<RawMetafield>) {
  if (metafield.value == null) {
    return metafield.value;
  }

  switch (metafield.type) {
    case 'boolean':
      return metafield.value == 'true';
    case 'number_integer':
      return parseInt(metafield.value);
    case 'number_decimal':
      return parseFloat(metafield.value);
    case 'date':
    case 'date_time':
      return new Date(metafield.value);
    case 'json':
    case 'weight':
    case 'dimension':
    case 'volume':
    case 'rating':
      return JSON.parse(metafield.value);
    case 'color':
    case 'single_line_text_field':
    case 'multi_line_text_field':
    case 'product_reference':
    case 'page_reference':
    case 'variant_reference':
    case 'file_reference':
    case 'url':
    default:
      return metafield.value;
  }
}
