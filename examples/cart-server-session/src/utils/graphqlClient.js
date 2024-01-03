import config from '../../hydrogen.config';

const {shopify} = config;

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

  const endpoint = `https://${shopify().storeDomain}/api/2022-07/graphql.json`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': shopify().storefrontToken,
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

  try {
    const response = await request.json();

    if (response?.errors?.length) {
      throw new Error(response.errors[0].message);
    }

    return {
      error: null,
      data: response.data,
    };
  } catch (error) {
    console.log('graphqlClient error', error);
    return {
      error: error.message,
      data: null,
    };
  }
}
