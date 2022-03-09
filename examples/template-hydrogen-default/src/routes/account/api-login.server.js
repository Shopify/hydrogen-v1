import gql from 'graphql-tag';

export async function api(request, {queryShop}) {
  const jsonBody = await request.json();

  const {data, error} = await queryShop({
    query: LOGIN,
    variables: {
      input: {
        email: jsonBody.email,
        password: jsonBody.password,
      },
    },
  });

  console.log('api login data', data);

  if (
    data &&
    data.customerAccessTokenCreate &&
    data.customerAccessTokenCreate.customerAccessToken !== null
  ) {
    // Todo: set cookie
    return {loginSuccess: true};
  } else {
    return {
      loginSuccess: false,
      error: data ? data.customerAccessTokenCreate.customerUserErrors : error,
    };
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
