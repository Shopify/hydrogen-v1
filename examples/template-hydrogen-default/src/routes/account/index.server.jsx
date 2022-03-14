import {useCookies} from '@shopify/hydrogen';
import Layout from '../../components/Layout.server';

const CUSTOMER_ACCESS_TOKEN_COOKIE_NAME = 'secure_customer_sig';

export default function Account({response}) {
  const cookies = useCookies();

  const customerFound = cookies.get(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME);
  if (!customerFound) {
    response.redirect('/account/login');
  }
  return <Layout>Account Page After Login</Layout>;
}
