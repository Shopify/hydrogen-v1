import {useSession} from '@shopify/hydrogen';

export function CartCount() {
  const {cartCount} = useSession();

  return <p>CART ({cartCount || 0})</p>;
}
