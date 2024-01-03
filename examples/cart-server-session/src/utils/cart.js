import {flattenConnection} from '@shopify/hydrogen';
import {graphqlClient} from '~/utils/graphqlClient';

import {
  CART_GET_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
} from '~/graphql';

export async function getCart({id}) {
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
