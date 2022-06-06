import {NoStore, gql} from '@shopify/hydrogen';

/**
 * This API route is used by the form on `/account/activate/[id]/[activationToken]`
 * complete the reset of the user's password.
 */
export async function api(request, {session, queryShop}) {
  const jsonBody = await request.json();

  if (!jsonBody?.id || !jsonBody?.password || !jsonBody?.activationToken) {
    return new Response(
      JSON.stringify({error: 'Incorrect password or activation token.'}),
      {
        status: 400,
      },
    );
  }

  const {data, errors} = await queryShop({
    query: ACTIVATE,
    variables: {
      id: `gid://shopify/Customer/${jsonBody.id}`,
      input: {
        password: jsonBody.password,
        activationToken: jsonBody.activationToken,
      },
    },
    cache: NoStore(),
  });

  if (data?.customerActivate?.customerAccessToken?.accessToken) {
    await session.set(
      'customerAccessToken',
      data.customerActivate.customerAccessToken.accessToken,
    );

    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: getErrorMessage(data, errors),
      }),
      {status: 401},
    );
  }
}

const ACTIVATE = gql`
  mutation customerActivate($id: ID!, $input: CustomerActivateInput!) {
    customerActivate(id: $id, input: $input) {
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

function getErrorMessage(data, errors) {
  if (errors?.length) return errors[0].message ?? errors[0];
  if (data?.customerActivate?.customerUserErrors?.length)
    return data.customerActivate.customerUserErrors[0].message;
  return null;
}
