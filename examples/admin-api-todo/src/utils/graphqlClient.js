/**
 * A basic Admin API fetch-based client.
 * @param {gql} query - GraphQL query
 * @param {object} variables - GraphQL variables
 * @returns {object} - {error: [], data: object}
 */
export async function graphqlClient(
  {query, variables} = {id: '', query: null, variables: {}}
) {
  if (!query) {
    throw new Error('Must provide a `query` to the admin client');
  }

  const endpoint = `https://${Oxygen.env.SHOPIFY_ADMIN_API_DOMAIN}/admin/api/${Oxygen.env.SHOPIFY_ADMIN_API_VERSION}/graphql.json`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': Oxygen.env.SHOPIFY_ADMIN_API_PRIVATE_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  const request = await fetch(endpoint, options);

  if (!request.ok) {
    throw new Error(
      `graphql api request not ok ${request.status} ${request.statusText}`
    );
  }

  const response = await request.json();

  if (response?.errors?.length) {
    throw new Error(response.errors[0].message);
  }

  return {
    error: null,
    data: response.data,
  };
}
