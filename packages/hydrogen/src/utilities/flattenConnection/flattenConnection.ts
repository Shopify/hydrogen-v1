import {GraphQLConnection} from '../../types';

/**
 * The `flattenConnection` utility transforms a connection object from the Storefront API (for example, [Product-related connections](api/storefront/reference/products/product#connections)) into a flat array of nodes.
 * ## Arguments
 * | Description | Required |
 * | ------------| --------- |
 * | A connection object with the field `edges` whose value is an array of objects corresponding to `{node: Value}`. For example, any of the [Product connections](api/storefront/reference/products/product#connections) | Yes |
 *
 * ## Return type
 * A flat array whose elements correspond to the `node` value in each element of the original `edges` array.
 */
export function flattenConnection<T>(connection: GraphQLConnection<T>): T[] {
  return (connection.edges ?? []).map((edge) => edge.node);
}
