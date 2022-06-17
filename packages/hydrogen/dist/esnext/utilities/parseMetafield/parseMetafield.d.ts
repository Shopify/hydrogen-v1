import type { Metafield } from '../../storefront-api-types';
import type { ParsedMetafield } from '../../types';
import type { PartialDeep } from 'type-fest';
/**
 * The `parseMetafield` utility transforms a [Metafield](https://shopify.dev/api/storefront/reference/common-objects/Metafield)
 * into a new object whose `values` have been parsed according to the metafield `type`.
 * If the metafield is `null`, then it returns `null` back.
 */
export declare function parseMetafield(
/** A [Metafield](https://shopify.dev/api/storefront/reference/common-objects/Metafield) or null */
metafield: PartialDeep<Metafield> | null): PartialDeep<ParsedMetafield> | null;
/**
 * The `parseMetafieldValue` function parses a [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `value` from a string into a sensible type corresponding to the [Metafield](https://shopify.dev/api/storefront/reference/common-objects/metafield)'s `type`.
 */
export declare function parseMetafieldValue(metafield: PartialDeep<Metafield> | null): ParsedMetafield['value'];
