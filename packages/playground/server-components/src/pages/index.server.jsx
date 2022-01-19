import {Link} from '@shopify/hydrogen';

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

      <div className="secrets">
        PRIVATE_VARIABLE:{Oxygen.env.PRIVATE_VARIABLE}
      </div>
    </>
  );
}
