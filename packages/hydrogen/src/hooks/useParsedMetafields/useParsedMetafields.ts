import {useMemo} from 'react';
import {flattenConnection, parseMetafieldValue} from '../../utilities';
import type {Metafield} from '../../storefront-api-types';
import type {PartialDeep} from 'type-fest';

/**
 * The `useParsedMetafields` hook transforms a [Metafield](https://shopify.dev/api/storefront/reference/common-objects/Metafield)
 * in an array of metafields whose `values` have been parsed according to the metafield `type`.
 */
export function useParsedMetafields(
  /** A [Metafield](https://shopify.dev/api/storefront/reference/common-objects/Metafield). */
  metafields?: Array<PartialDeep<Metafield>>
) {
  return useMemo(() => {
    if (!metafields) {
      throw new Error(`'useParsedMetafields' needs metafields`);
    }
    return flattenConnection(metafields).map((metafield) => {
      return {
        ...metafield,
        value: parseMetafieldValue(metafield),
      };
    });
  }, [metafields]);
}
