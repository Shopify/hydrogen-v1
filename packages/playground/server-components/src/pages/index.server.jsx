import {Link} from '@shopify/hydrogen';

export default function Index() {
  return (
    <>
      <h1>Home</h1>
      <Link className="btn" to="/about">
        About
      </Link>

      <div className="secrets">SECRET_TEST:{Oxygen.env.SECRET_TEST}</div>
    </>
  );
}
