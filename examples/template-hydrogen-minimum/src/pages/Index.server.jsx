import {Link, Image} from '@shopify/hydrogen';
import Welcome from '../components/Welcome.server';

export default function Index() {
  return (
    <div className="Page">
      <Image src="logo.png" width="100" height="100" />
      <Welcome />
      <p>
        <Link className="link" to="/about">
          About
        </Link>
      </p>
    </div>
  );
}
