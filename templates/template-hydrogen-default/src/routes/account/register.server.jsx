import {NoStore, Seo} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../../components/Layout.server';
import AccountCreateForm from '../../components/AccountCreateForm.client';

export default function Register({response}) {
  response.cache(NoStore());

  return (
    <Layout>
      <Seo type="noindex" data={{title: 'Register'}} />
      <AccountCreateForm />
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
      JSON.stringify({error: 'Email and password are required'}),
      {status: 400},
    );
  }

  const {data, error, errors} = await queryShop({
    query: LOGIN,
    variables: {
      input: {
        email: jsonBody.email,
        password: jsonBody.password,
        firstName: jsonBody.firstName,
        lastName: jsonBody.lastName,
      },
    },
    cache: NoStore(),
  });

  const errorMessage = getErrorMessage(data, error, errors);

  if (
    !errorMessage &&
    data &&
    data.customerCreate &&
    data.customerCreate.customer &&
    data.customerCreate.customer.id
  ) {
    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: errorMessage ?? 'Unknown error',
      }),
      {status: 401},
    );
  }
}

const LOGIN = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

function getErrorMessage(data, error, errors) {
  if (error?.message) return error.message;
  if (errors?.length) return errors[0].message ?? errors[0];
  if (data?.customerCreate?.customerUserErrors?.length)
    return data.customerCreate.customerUserErrors[0].message;
  return null;
}
