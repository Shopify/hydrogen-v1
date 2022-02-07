import {Link} from '@shopify/hydrogen';

export default function About() {
  return (
    <div className="Page">
      <h1>About</h1>
      <p>Share your journey.</p>
      <p>
        <Link className="link" to="/">
          Back
        </Link>
      </p>
    </div>
  );
}
