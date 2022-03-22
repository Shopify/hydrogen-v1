import {NoStore} from '@shopify/hydrogen';
import gql from 'graphql-tag';
import {stringify as stringifyCookie} from 'worktop/cookie';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from '../../constants/cookies';

import Layout from '../../components/Layout.server';
import LoginForm from '../../components/LoginForm.client';

export default function Login() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Login</h1>
      <LoginForm />
    </Layout>
  );
}

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
    cache: NoStore(),
  });

  if (
    data &&
    data.customerAccessTokenCreate &&
    data.customerAccessTokenCreate.customerAccessToken !== null
  ) {
    const {accessToken, expiresAt} =
      data.customerAccessTokenCreate.customerAccessToken;

    return new Response(null, {
      headers: {
        'Set-Cookie': stringifyCookie(
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
