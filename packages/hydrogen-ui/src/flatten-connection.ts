import type {PartialDeep} from 'type-fest';

/**
 * The `flattenConnection` utility transforms a connection object from the Storefront API (for example, [Product-related connections](https://shopify.dev/api/storefront/reference/products/product)) into a flat array of nodes.
 * The utility works with either `nodes` or `edges.node`.
 */
export function flattenConnection<T>(
  connection: PartialDeep<GraphQLConnection<T>>
): PartialDeep<T>[] {
  if (connection.nodes) {
    return connection.nodes as PartialDeep<T>[];
  }

  if (connection.edges) {
    return connection.edges.map((edge) => {
      if (!edge?.node) {
        throw new Error('Connection edges must contain nodes');
      }
      return edge.node;
    });
  }

  if (__HYDROGEN_DEV__) {
    console.warn(
      `The connection did not contain either "nodes" or "edges.node". A empty array will be returned in its place.`
    );
  }

  return [];
}

interface GraphQLConnection<T> {
  edges?: {node: T}[];
  nodes?: T[];
}
