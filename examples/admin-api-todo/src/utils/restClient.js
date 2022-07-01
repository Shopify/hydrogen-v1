/**
 * A basic Admin API rest client.
 * @param {string} resource - Resource name
 * @param {object} body - GraphQL variables
 * @returns {object} - {error: [], data: object}
 */
export async function restClient({resource, body}) {
  const endpoint = `https://${Oxygen.env.SHOPIFY_ADMIN_API_DOMAIN}/admin/api/${Oxygen.env.SHOPIFY_ADMIN_API_VERSION}/${resource}.json`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': Oxygen.env.SHOPIFY_ADMIN_API_PRIVATE_TOKEN,
    },
    body: JSON.stringify(body),
  };

  const request = await fetch(endpoint, options);

  if (!request.ok) {
    throw new Error(
      `Failed to fetch ${resource}.json. ${request.status} ${request.statusText}`
    );
  }

  const response = await request.json();

  if (response?.errors?.length) {
    throw new Error(response.errors[0].message);
  }

  return {
    error: null,
    data: response,
  };
}
