import React from 'react';
import {Link} from '@shopify/hydrogen';
import {LoginForm} from '~/components/client';
import {
  CacheNone,
  gql,
  HydrogenRequest,
  HydrogenApiRouteOptions,
} from '@shopify/hydrogen';

export default function Login() {
  return (
    <>
      <h1>Sign in.</h1>
      <LoginForm />
      <br />
      <Link to="/">Back home</Link>
    </>
  );
}

export async function api(
  request: HydrogenRequest,
  {session, queryShop}: HydrogenApiRouteOptions
) {
  if (!session) {
    return new Response('Session storage not available.', {status: 400});
  }

  const body = await request.json();

  if (
    !body.email ||
    body.email === '' ||
    !body.password ||
    body.password === ''
  ) {
    return new Response(
      JSON.stringify({error: 'Incorrect email or password.'}),
      {status: 400}
    );
  }

  const {data, errors} = await queryShop<{customerAccessTokenCreate: any}>({
    query: LOGIN_MUTATION,
    variables: {
      input: {
        email: body.email,
        password: body.password,
      },
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  const customerAccessToken =
    data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
  console.log('customerAccessToken', customerAccessToken);

  if (!customerAccessToken) {
    return new Response(
      JSON.stringify({
        error: data?.customerAccessTokenCreate?.customerUserErrors ?? errors,
      }),
      {status: 401}
    );
  }

  await session.set('customerAccessToken', customerAccessToken);

  return new Response(null, {
    status: 303,
    headers: {
      'Cache-Control': 'no-cache',
      Location: '/account',
    },
  });
}

const LOGIN_MUTATION = gql`
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
