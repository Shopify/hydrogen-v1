import gql from 'graphql-tag';
import cookie from 'cookie';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from '../../constants/cookies';

export async function api(request, {queryShop}) {
  const jsonBody = await request.json();

  if (
    !jsonBody.email ||
    jsonBody.email === '' ||
    !jsonBody.password ||
    jsonBody.password === ''
  ) {
    return new Response(
      JSON.stringify({error: 'Incorrect email or password.'}),
      {status: 400},
    );
  }

  const {data, error} = await queryShop({
    query: LOGIN,
    variables: {
      input: {
        email: jsonBody.email,
        password: jsonBody.password,
      },
    },
  });

  if (
    data &&
    data.customerAccessTokenCreate &&
    data.customerAccessTokenCreate.customerAccessToken !== null
  ) {
    // set cookie on server
    const {accessToken, expiresAt} =
      data.customerAccessTokenCreate.customerAccessToken;
    request.cookies.set(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME, accessToken);

    // set cookie in response
    return new Response(null, {
      headers: {
        'Set-Cookie': cookie.serialize(
          CUSTOMER_ACCESS_TOKEN_COOKIE_NAME,
          accessToken,
          {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            expires: new Date(expiresAt),
          },
        ),
      },
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: data ? data.customerAccessTokenCreate.customerUserErrors : error,
      }),
      {status: 401},
    );
  }
}

const LOGIN = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;
