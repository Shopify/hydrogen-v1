import {Link} from '@shopify/hydrogen';
import ClientEnv from '../components/ClientEnv.client';

export function api() {
  return new Response('some api response');
}

export default function Index() {
  return (
    <>
      <h1>Home</h1>
      <Link className="btn" to="/about">
        About
      </Link>

      <div className="secrets-server">
        <div>PUBLIC_VARIABLE:{import.meta.env.PUBLIC_VARIABLE || ''}|</div>
        <div>PRIVATE_VARIABLE:{Oxygen.env.PRIVATE_VARIABLE || ''}|</div>
      </div>

      <div className="secrets-client">
        <ClientEnv />
      </div>
    </>
  );
}
