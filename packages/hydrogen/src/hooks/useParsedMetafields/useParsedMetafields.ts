import {useMemo} from 'react';
import {GraphQLConnection, ParsedMetafield} from '../../types';
import {Metafield} from '../../graphql/types/types';
import {flattenConnection, parseMetafieldValue} from '../../utilities';

/**
 * The `useParsedMetafields` hook transforms a [MetafieldConnection](/api/storefront/reference/common-objects/metafieldconnection)
 * in an array of metafields whose `values` have been parsed according to the metafield `type`.
 */
export function useParsedMetafields(
  metafields: GraphQLConnection<Partial<Metafield>> | undefined
): ParsedMetafield[] {
  return useMemo(() => {
    if (metafields == null) {
      return [];
    }
    return flattenConnection(metafields).map((metafield) => {
      return {
        ...metafield,
        value: parseMetafieldValue(metafield),
      };
    });
  }, [metafields]);
}
