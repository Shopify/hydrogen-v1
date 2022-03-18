import type {GraphQLConnection} from '../../types';
import type {PartialDeep} from 'type-fest';

/**
 * The `flattenConnection` utility transforms a connection object from the Storefront API (for example, [Product-related connections](/api/storefront/reference/products/product)) into a flat array of nodes.
 */
export function flattenConnection<T>(
  connection: PartialDeep<GraphQLConnection<T>>
): PartialDeep<T>[] {
  if (!connection.edges || connection.edges.length < 1) {
    throw new Error('must have edges');
  }
  return connection.edges.map((edge) => {
    if (!edge?.node) {
      throw new Error('must have node');
    }
    return edge.node;
  });
}
