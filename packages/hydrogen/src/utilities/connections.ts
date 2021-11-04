import {GraphQLConnection} from '../types';

export function flattenConnection<T>(connection: GraphQLConnection<T>): T[] {
  return (connection.edges ?? []).map((edge) => edge.node);
}
