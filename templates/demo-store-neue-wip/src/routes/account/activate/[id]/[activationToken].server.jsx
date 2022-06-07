import {useRouteParams, Seo} from '@shopify/hydrogen';

import Layout from '../../../../components/layouts/DefaultLayout.server';
import AccountActivateForm from '../../../../components/sections/AccountActivateForm.client';

/**
 * This page shows a form for the user to activate an account.
 * It should only be accessed by a link emailed to the user.
 */
export default function Reset() {
  const {id, activationToken} = useRouteParams();

  return (
    <Layout>
      <Seo type="noindex" data={{title: 'Activate account'}} />
      <AccountActivateForm id={id} activationToken={activationToken} />
    </Layout>
  );
}
