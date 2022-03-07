import {useRouteParams} from '@shopify/hydrogen';

import Layout from '../../../../components/Layout.server';
import PasswordResetForm from '../../../../components/PasswordResetForm.client';

export default function Reset() {
  const {id, resetToken} = useRouteParams();

  return (
    <Layout>
      <PasswordResetForm id={id} resetToken={resetToken} />
    </Layout>
  );
}
