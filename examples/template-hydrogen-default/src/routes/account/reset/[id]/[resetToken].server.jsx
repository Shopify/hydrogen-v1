import {useRouteParams} from '@shopify/hydrogen';

import Layout from '../../../../components/Layout.server';
import PasswordResetForm from '../../../../components/PasswordResetForm.client';

export default function Reset() {
  const {id, resetToken} = useRouteParams();

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Reset account password</h1>
      <p>Enter a new password for your account</p>
      <PasswordResetForm id={id} resetToken={resetToken} />
    </Layout>
  );
}
