import {Link} from '@shopify/hydrogen';

export default function Index() {
  return (
    <>
      <h1>Home</h1>
      <Link className="btn" to="/about">
        About
      </Link>

      <div className="secrets">{JSON.stringify(Oxygen.env)}</div>
    </>
  );
}
