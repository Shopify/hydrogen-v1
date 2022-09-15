import {Suspense} from 'react';
import {
  useShopQuery,
  CacheLong,
  CacheNone,
  Seo,
  gql,
  type HydrogenRouteProps,
  HydrogenRequest,
  HydrogenApiRouteOptions,
} from '@shopify/hydrogen';

import {AccountLoginForm} from '~/components';
import {Layout} from '~/components/index.server';
import {
  CustomerAccessToken,
  CustomerUserError,
  Shop,
} from '@shopify/hydrogen/storefront-api-types';

export default function Login({response}: HydrogenRouteProps) {
  response.cache(CacheNone());

  const {data, errors} = useShopQuery<{shop: Shop}>({
    query: SHOP_QUERY,
    cache: CacheLong(),
    preload: '*',
  });

  if (!data || errors) {
    throw new Error(
      `There were either errors or no data returned for the query. ${
        errors?.length &&
        `Errors: ${errors.map((err) => err.message).join('. ')}`
      }`,
    );
  }

  const {
    shop: {name},
  } = data;

  return (
    <Layout>
      <Suspense>
        <Seo type="noindex" data={{title: 'Login'}} />
      </Suspense>
      <AccountLoginForm shopName={name} />
    </Layout>
  );
}

const SHOP_QUERY = gql`
  query shopInfo {
    shop {
      name
    }
  }
`;

export async function api(
  request: HydrogenRequest,
  {session, queryShop}: HydrogenApiRouteOptions,
) {
  if (!session) {
    return new Response('Session storage not available.', {status: 400});
  }

  const jsonBody = await request.json();

  if (!jsonBody.email || !jsonBody.password) {
    return new Response(
      JSON.stringify({error: 'Incorrect email or password.'}),
      {status: 400},
    );
  }

  const {data, errors} = await queryShop<{
    customerAccessTokenCreate: {
      customerUserErrors: CustomerUserError;
      customerAccessToken: CustomerAccessToken;
    };
  }>({
    query: LOGIN_MUTATION,
    variables: {
      input: {
        email: jsonBody.email,
        password: jsonBody.password,
      },
    },
    // @ts-expect-error `queryShop.cache` is not yet supported but soon will be.
    cache: CacheNone(),
  });

  if (!data || errors) {
    throw new Error(
      `There were either errors or no data returned for the query. ${
        errors?.length &&
        `Errors: ${errors.map((err) => err.message).join('. ')}`
      }`,
    );
  }

  if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    await session.set(
      'customerAccessToken',
      data.customerAccessTokenCreate.customerAccessToken.accessToken,
    );

    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: data?.customerAccessTokenCreate?.customerUserErrors ?? errors,
      }),
      {status: 401},
    );
  }
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
