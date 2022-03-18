import {useMemo} from 'react';
import {flattenConnection, parseMetafieldValue} from '../../utilities';
import type {MetafieldConnection} from '../../storefront-api-types';
import type {PartialDeep} from 'type-fest';

/**
 * The `useParsedMetafields` hook transforms a [MetafieldConnection](/api/storefront/reference/common-objects/metafieldconnection)
 * in an array of metafields whose `values` have been parsed according to the metafield `type`.
 */
export function useParsedMetafields(
  metafields?: PartialDeep<MetafieldConnection>
) {
  metafields?.edges?.[0]?.node;
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
