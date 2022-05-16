import {Link} from '@shopify/hydrogen';

export function api() {
  return new Response('some api response');
}

export default function Index() {
  return (
    <>
      <h1>Home</h1>

      <div>Quotes should not make it crash: ` ' "</div>

      <Link className="btn" to="/about">
        About
      </Link>
      <br />
      <Link className="redirect-btn" to="/redirected">
        Redirect
      </Link>
    </>
  );
}
