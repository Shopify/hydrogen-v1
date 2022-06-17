import { parseJSON } from '../parse';
/**
 * The `parseMetafield` utility transforms a [Metafield](https://shopify.dev/api/storefront/reference/common-objects/Metafield)
 * into a new object whose `values` have been parsed according to the metafield `type`.
 * If the metafield is `null`, then it returns `null` back.
 */
export function parseMetafield(
/** A [Metafield](https://shopify.dev/api/storefront/reference/common-objects/Metafield) or null */
metafield) {
    if (!metafield) {
        return null;
    }
    if (__HYDROGEN_DEV__ &&
        (metafield.value === null || metafield.value === undefined)) {
        console.warn(`'parseMetafield()' was passed ${metafield.value} for 'metafield.value'`);
    }
    return {
        ...metafield,
        value: parseMetafieldValue(metafield),
    };
}
/**
 * The `parseMetafieldValue` function parses a [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `value` from a string into a sensible type corresponding to the [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `type`.
 */
export function parseMetafieldValue(metafield) {
    if (!metafield) {
        return null;
    }
    if (metafield.value === null || metafield.value === undefined) {
        if (__HYDROGEN_DEV__) {
            console.warn(`'parseMetafieldValue()' was passed ${metafield.value} for 'metafield.value'`);
        }
        return metafield.value;
    }
    switch (metafield.type) {
        case 'boolean':
            return metafield.value === 'true';
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
