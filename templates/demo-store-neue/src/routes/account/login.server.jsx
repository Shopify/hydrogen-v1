import {useShopQuery, CacheDays, NoStore, Seo, gql} from '@shopify/hydrogen';

import {DefaultLayout as Layout} from '~/components/layouts';
import LoginForm from '~/components/sections';

export default function Login({response}) {
  response.cache(NoStore());

  const {
    data: {
      shop: {name},
    },
  } = useShopQuery({
    query: QUERY,
    cache: CacheDays(),
    preload: '*',
  });

  return (
    <Layout>
      <Seo type="noindex" data={{title: 'Login'}} />
      <LoginForm shopName={name} />
    </Layout>
  );
}

const QUERY = gql`
  query shopInfo {
    shop {
      name
    }
  }
`;

export async function api(request, {session, queryShop}) {
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
    data?.customerAccessTokenCreate?.customerAccessToken?.accessToken !== null
  ) {
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
        error: data?.customerAccessTokenCreate?.customerUserErrors ?? error,
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
