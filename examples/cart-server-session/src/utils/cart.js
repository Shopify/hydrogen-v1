import {gql} from '@shopify/hydrogen';
import {flattenConnection} from '@shopify/hydrogen';
import {
  CART_GET_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
} from '~/graphql';

export async function getCart({id}) {
  console.log('getCart:getting cart with id', id);
  try {
    const result = await graphqlClient({
      query: CART_GET_QUERY,
      variables: {id},
    });

    const {data, errors} = result;

    if (errors?.length) {
      console.log('get:Fetching existing cart error', errors);
      throw new Error(errors[0].message);
    }

    return {
      ...data.cart,
      lines: flattenConnection(data.cart.lines),
    };
  } catch (error) {
    console.log('error:get:Fetching existing cart error', error);
    return null;
  }
}

export async function createCart(input) {
  console.log('createCart:creating a cart with', input);
  const {data, errors} = await graphqlClient({
    query: CART_CREATE_MUTATION,
    variables: {input},
  });

  if (errors) {
    console.log('createCart:new cart error', errors);
    throw new Error(errors[0].message);
  }

  return {
    ...data.query.cart,
    lines: flattenConnection(data.query.cart.lines),
  };
}

export async function cartLinesAdd(input) {
  console.log('cartLinesAdd:Adding lines to the cart', input);
  const {data, errors} = await graphqlClient({
    query: CART_LINES_ADD_MUTATION,
    variables: input,
  });

  if (errors) {
    console.log('cartLinesAdd: add lines error', errors);
    throw new Error(errors[0].message);
  }

  return {
    ...data.query.cart,
    lines: flattenConnection(data.query.cart.lines),
  };
}

export async function cartLinesRemove(input) {
  console.log('cartLinesRemove:Removing lines from the cart', input);
  const {data, errors} = await graphqlClient({
    query: CART_LINES_REMOVE_MUTATION,
    variables: input,
  });

  if (errors) {
    console.log('cartLinesRemove:Removing lines error', errors);
    throw new Error(errors[0].message);
  }

  return {
    ...data.query.cart,
    lines: flattenConnection(data.query.cart.lines),
  };
}

/**
 * A basic Admin API fetch-based client.
 * @param {gql} query - GraphQL query
 * @param {object} variables - GraphQL variables
 * @returns {object} - {error: [], data: object}
 */
async function graphqlClient(
  {query, variables} = {id: '', query: null, variables: {}}
) {
  if (!query) {
    throw new Error('Must provide a `query` to the admin client');
  }

  const endpoint = `https://hydrogen-preview.myshopify.com/api/2022-07/graphql.json`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '3b580e70970c4528da70c98e097c2fa0',
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
