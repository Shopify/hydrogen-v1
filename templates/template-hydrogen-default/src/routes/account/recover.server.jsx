import {NoStore} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../../components/Layout.server';
import AccountRecoverForm from '../../components/AccountRecoverForm.client';

export default function Recover() {
  return (
    <Layout>
      <AccountRecoverForm />
    </Layout>
  );
}

export async function api(request, {queryShop}) {
  const jsonBody = await request.json();

  if (!jsonBody.email || jsonBody.email === '') {
    return new Response(JSON.stringify({error: 'Incorrect email.'}), {
      status: 400,
    });
  }

  const {data, error} = await queryShop({
    query: LOGIN,
    variables: {
      email: jsonBody.email,
    },
    cache: NoStore(),
  });

  if (
    data?.customerRecover === null ||
    data?.customerRecover?.customerUserErrors?.lenghth === 0
  ) {
    return new Response(null, {
      status: 200,
    });
  } else {
    return new Response(
      JSON.stringify({
        error: data?.customerRecover?.customerUserErrors || error,
      }),
      {status: 401},
    );
  }
}

const LOGIN = gql`
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
