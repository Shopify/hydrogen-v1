/**
 * The `flattenConnection` utility transforms a connection object from the Storefront API (for example, [Product-related connections](https://shopify.dev/api/storefront/reference/products/product)) into a flat array of nodes.
 * The utility works with either `nodes` or `edges.node`.
 */
export function flattenConnection(connection) {
    if (connection.nodes) {
        return connection.nodes;
    }
    if (connection.edges) {
        return connection.edges.map((edge) => {
            if (!edge?.node) {
                throw new Error('Connection edges must contain nodes');
            }
            return edge.node;
        });
    }
    return [];
}
