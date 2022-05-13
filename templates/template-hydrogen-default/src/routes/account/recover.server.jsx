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
    return new Response(JSON.stringify({error: 'Email required'}), {
      status: 400,
    });
  }

  await queryShop({
    query: LOGIN,
    variables: {
      email: jsonBody.email,
    },
    cache: NoStore(),
  });

  // Ignore errors, we don't want to tell the user if the email was
  // valid or not, thereby allowing them to determine who uses the site
  return new Response(null, {
    status: 200,
  });
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
