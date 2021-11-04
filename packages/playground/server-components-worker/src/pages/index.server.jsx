import {Link} from '../components/Link.client';

export default function Index() {
  return (
    <>
      <h1>Home</h1>
      <Link className="btn" to="/about">
        About
      </Link>
    </>
  );
}
