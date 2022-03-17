import {CacheCustom, useCookies} from '@shopify/hydrogen';

import AccountDetails from '../components/AccountDetails.server';
import Layout from '../components/Layout.server';
import LoginForm from '../components/LoginForm.client';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from '../constants/cookies';

export default function Account({response}) {
  // disabled full page cache
  response.cache(
    CacheCustom({
      mode: 'no-store',
    }),
  );

  const cookies = useCookies();

  const customerAccessToken = cookies.get(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME);

  return customerAccessToken ? (
    <AccountDetails customerAccessToken={customerAccessToken} />
  ) : (
    <Layout>
      <h1 className="text-2xl font-bold">Login</h1>
      <LoginForm />
    </Layout>
  );
}
