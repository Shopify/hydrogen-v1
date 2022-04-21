import type {GraphQLConnection} from '../../types';
import type {PartialDeep} from 'type-fest';

/**
 * The `flattenConnection` utility transforms a connection object from the Storefront API (for example, [Product-related connections](https://shopify.dev/api/storefront/reference/products/product)) into a flat array of nodes.
 */
export function flattenConnection<T>(
  connection: PartialDeep<GraphQLConnection<T>>
): PartialDeep<T>[] {
  return (connection.edges || []).map((edge) => {
    if (!edge?.node) {
      throw new Error('Connection edges must contain nodes');
    }
    return edge.node;
  });
}
