import {NoStore, setCustomerAccessToken} from '@shopify/hydrogen';
import gql from 'graphql-tag';

export async function api(_request, {session, queryShop}) {
  const sessionData = await session.get();
  const customerAccessToken = sessionData['secure_customer_sig'];

  const {data, error} = await queryShop({
    query: LOGIN,
    variables: {
      customerAccessToken: customerAccessToken || '',
    },
    cache: NoStore(),
  });

  if (
    data &&
    data.customerAccessTokenRenew &&
    data.customerAccessTokenRenew.customerAccessToken !== null
  ) {
    await setCustomerAccessToken(
      session,
      data.customerAccessTokenRenew.customerAccessToken,
    );

    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: data ? data.customerAccessTokenRenew.userErrors : error,
      }),
      {status: 401},
    );
  }
}

const LOGIN = gql`
  mutation customerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      userErrors {
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
