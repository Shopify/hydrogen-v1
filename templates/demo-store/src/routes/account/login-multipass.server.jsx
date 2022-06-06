// import Multipassify from 'multipassify';
import {NoStore, gql} from '@shopify/hydrogen';
import shopifyConfig from '../../../hydrogen.config';

export async function api(request, {session, queryShop}) {
  const searchParams = new URL(request.url).searchParams;

  const returnURL = searchParams.get('returnurl');
  const failURL = searchParams.get('failurl');

  const multipassSecret = shopifyConfig.multipassSecret;

  // Todo: get customer email from session
  const customerEmail = 'some@email.com';

  const multipassToken = encodeCustomerData(multipassSecret, customerEmail);

  const {data, error} = await queryShop({
    query: LOGIN,
    variables: {
      multipassToken,
    },
    cache: NoStore(),
  });

  if (
    data &&
    data.customerAccessTokenCreateWithMultipass &&
    data.customerAccessTokenCreateWithMultipass.customerAccessToken !== null
  ) {
    await session.set(
      'customerAccessToken',
      data.customerAccessTokenCreateWithMultipass.customerAccessToken,
    );

    return new Response(null, {
      headers: {
        Location: returnURL,
      },
      status: 301,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: data
          ? data.customerAccessTokenCreateWithMultipass.customerUserErrors
          : error,
      }),
      {
        headers: {
          Location: failURL,
        },
        status: 301,
      },
    );
  }
}

function encodeCustomerData(multipassSecret, customerEmail) {
  return multipassSecret + customerEmail;
  //Todo: this lib uses cryto that only works in NodeJS
  // const multipassify = new Multipassify(multipassSecret);

  // return multipassify.encode({
  //   email: customerEmail,
  // });
}

const LOGIN = gql`
  mutation customerAccessTokenCreateWithMultipass($multipassToken: String!) {
    customerAccessTokenCreateWithMultipass(multipassToken: $multipassToken) {
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
