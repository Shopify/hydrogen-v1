import {ASTNode} from 'graphql';
import {
  useQuery,
  isClient,
  fetchBuilder,
  graphqlRequestBody,
  decodeShopifyId
} from '@shopify/hydrogen';
export interface UseSanityQueryResponse<T> {
  /** The data returned by the query. */
  data: T;
  errors: any;
}

/**
 * The `useSanityQuery` hook allows you to make server-only GraphQL queries to a Sanity GraphQL endpoint.
 */
export function useSanityQuery<T>({
  query,
  variables = {},
}: {
  /** A string of the GraphQL query. */
  query: ASTNode | string;
  /** An object of the variables for the GraphQL query. */
  variables?: Record<string, any>;
}): UseSanityQueryResponse<T> {
  if (isClient()) {
    throw new Error(
      'Sanity requests should only be made from the server.'
    );
  }

  // @ts-ignore
  const sanityId = import.meta.env.VITE_SANITY_ID; 
  // @ts-ignore
  const sanityToken = import.meta.env.VITE_SANITY_TOKEN;

  if (!sanityId || !sanityToken) {
    throw new Error('VITE_SANITY_ID and VITE_SANITY_TOKEN environment variables must exist to make use of useSanityQuery hook.')
  }

  if (variables.id) {
    variables.id = decodeShopifyId(variables.id)
  }

  const body = graphqlRequestBody(query, variables);
  const url = `https://${sanityId}.api.sanity.io/v1/graphql/graphql/default`;

  const request = new Request(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sanityToken}`,
      'content-type': 'application/json',
    },
    body,
  });

  const {data} = useQuery<UseSanityQueryResponse<T>>(
    [sanityId, body],
    fetchBuilder<UseSanityQueryResponse<T>>(request),
  );
  
  return data as UseSanityQueryResponse<T>;
}

