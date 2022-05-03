import {Link} from '@shopify/hydrogen';

export default function ProductDetails() {
  return (
    <>
      <h1>ProductDetails</h1>
      <Link prefetch={false} to="/collection">
        Go to Collection
      </Link>
    </>
  );
}
