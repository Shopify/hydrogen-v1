import {NoStore, Seo, gql} from '@shopify/hydrogen';

import Layout from '../../components/Layout.server';
import AccountRecoverForm from '../../components/account/AccountRecoverForm.client';

/**
 * A form for the user to fill out to _initiate_ a password reset.
 * If the form succeeds, an email will be sent to the user with a link
 * to reset their password. Clicking the link leads the user to the
 * page `/account/reset/[resetToken]`.
 */
export default function Recover({response}) {
  response.cache(NoStore());

  return (
    <Layout>
      <Seo type="noindex" data={{title: 'Recover password'}} />
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
    query: MUTATION,
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

const MUTATION = gql`
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
