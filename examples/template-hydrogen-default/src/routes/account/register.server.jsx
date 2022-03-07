import {AccountRegisterForm} from '../../components/AccountRegisterForm.client';

import Layout from '../../components/Layout.server';

export default function Register() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Create Account</h1>
      <AccountRegisterForm />
    </Layout>
  );
}
