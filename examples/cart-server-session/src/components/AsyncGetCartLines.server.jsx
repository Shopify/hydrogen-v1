import {useSession} from '@shopify/hydrogen';
import {getCart} from '~/utils/cart';
import {suspendedFn} from '~/utils/suspendedFn';
import {CartLines} from '~/components/CartLines.server';

const getCartLinesSync = suspendedFn(getCart);

export function AsyncGetCartLines() {
  const {cartId} = useSession();
  const cart = cartId ? getCartLinesSync({id: cartId}) : [];

  return <CartLines lines={cart?.lines ?? []} />;
}
