import {useCartLinesTotalQuantity} from '@shopify/hydrogen/client';

import CartIcon from './CartIcon';

export default function CartIconWithItems() {
  const itemCount = useCartLinesTotalQuantity();

  return (
    <>
      <div className="relative">
        <CartIcon />

        <div
          className={`bg-blue-700 text-xs rounded-full leading-none text-white absolute bottom-3 right-1 flex items-center justify-center transform translate-y-1/2 transition-all ${
            itemCount > 0 ? 'h-4 w-4' : 'h-0 w-0 overflow-hidden'
          }`}
          aria-hidden
        >
          {itemCount > 0 ? itemCount : null}
        </div>
      </div>
      <span className="sr-only">Cart, {itemCount} items</span>
    </>
  );
}
