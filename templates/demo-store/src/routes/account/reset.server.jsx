import {NoStore, gql} from '@shopify/hydrogen';

/**
 * This API route is used by the form on `/account/reset/[id]/[resetToken]`
 * complete the reset of the user's password.
 */
export async function api(request, {session, queryShop}) {
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

  const {data, errors} = await queryShop({
    query: MUTATION,
    variables: {
      id: `gid://shopify/Customer/${jsonBody.id}`,
      input: {
        password: jsonBody.password,
        resetToken: jsonBody.resetToken,
      },
    },
    cache: NoStore(),
  });

  if (data?.customerReset?.customerAccessToken?.accessToken !== null) {
    await session.set(
      'customerAccessToken',
      data.customerReset.customerAccessToken.accessToken,
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

const MUTATION = gql`
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

function getErrorMessage(data, errors) {
  if (errors?.length) return errors[0].message ?? errors[0];
  if (data?.customerReset?.customerUserErrors?.length)
    return data.customerReset.customerUserErrors[0].message;
  return null;
}
