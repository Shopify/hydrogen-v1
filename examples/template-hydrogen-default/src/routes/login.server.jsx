import Layout from '../components/Layout.server';
import LoginForm from '../components/LoginForm.client';

export default function Login() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Login</h1>
      <LoginForm />
    </Layout>
  );
}
