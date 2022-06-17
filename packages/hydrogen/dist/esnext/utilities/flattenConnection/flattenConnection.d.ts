import type { GraphQLConnection } from '../../types';
import type { PartialDeep } from 'type-fest';
/**
 * The `flattenConnection` utility transforms a connection object from the Storefront API (for example, [Product-related connections](https://shopify.dev/api/storefront/reference/products/product)) into a flat array of nodes.
 * The utility works with either `nodes` or `edges.node`.
 */
export declare function flattenConnection<T>(connection: PartialDeep<GraphQLConnection<T>>): PartialDeep<T>[];
