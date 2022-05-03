import {Link} from '@shopify/hydrogen/client';

export default function CollectionDetails() {
  return (
    <>
      <h1>Collection</h1>
      <Link prefetch={false} to="/product">
        Go to product
      </Link>
    </>
  );
}
