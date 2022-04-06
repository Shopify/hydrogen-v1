import {NoStore} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from '../../constants';

export async function api(request, {queryShop, session}) {
  const jsonBody = await request.json();

  if (
    !jsonBody.id ||
    jsonBody.id === '' ||
    !jsonBody.password ||
    jsonBody.password === '' ||
    !jsonBody.resetToken ||
    jsonBody.resetToken === ''
  ) {
    return new Response(
      JSON.stringify({error: 'Incorrect password or reset token.'}),
      {
        status: 400,
      },
    );
  }

  const {data, error} = await queryShop({
    query: LOGIN,
    variables: {
      id: `gid://shopify/Customer/${jsonBody.id}`,
      input: {
        password: jsonBody.password,
        resetToken: jsonBody.resetToken,
      },
    },
    cache: NoStore(),
  });

  if (
    data &&
    data.customerReset &&
    data.customerReset.customerAccessToken !== null
  ) {
    await session.set(
      CUSTOMER_ACCESS_TOKEN_COOKIE_NAME,
      data.customerAccessTokenCreate.customerAccessToken.accessToken,
    );

    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: data ? data.customerReset.customerUserErrors : error,
      }),
      {status: 401},
    );
  }
}

const LOGIN = gql`
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
