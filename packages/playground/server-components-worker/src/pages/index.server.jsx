import {Link} from '@shopify/hydrogen';
import ClientEnv from '../components/ClientEnv.client';

export default function Index() {
  return (
    <>
      <h1>Home</h1>
      <Link className="btn" to="/about">
        About
      </Link>

      <div className="secrets-server">
        <div>PUBLIC_VAR:{Oxygen.env.HYDROGEN_PUBLIC_TEST || ''}|</div>
        <div>PRIVATE_VAR:{Oxygen.env.HYDROGEN_PRIVATE_TEST || ''}|</div>
      </div>

      <div className="secrets-client">
        <ClientEnv />
      </div>
    </>
  );
}
