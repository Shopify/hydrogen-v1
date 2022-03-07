import Layout from '../../components/Layout.server';

export default function Account({response}) {
  const customerFound = false;
  if (!customerFound) {
    response.redirect('/account/login');
  }
  return <Layout>Account Page After Login</Layout>;
}
