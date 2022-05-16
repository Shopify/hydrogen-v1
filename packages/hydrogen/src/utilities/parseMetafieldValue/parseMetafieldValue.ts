import type {Metafield} from '../../storefront-api-types';
import type {PartialDeep} from 'type-fest';
import {parseJSON} from '../parse';

/**
 * The `parseMetafieldValue` function parses a [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `value` from a string into a sensible type corresponding to the [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `type`.
 */
export function parseMetafieldValue(metafield: PartialDeep<Metafield>) {
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
      return parseJSON(metafield.value);
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
