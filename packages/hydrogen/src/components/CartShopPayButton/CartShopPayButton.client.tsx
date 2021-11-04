import React, {useMemo} from 'react';
import {useCart} from '../CartProvider';
import {ShopPayButton, ShopPayButtonProps} from '../ShopPayButton';

/**
 * The `CartShopPayButton` component renders a `ShopPayButton` for the items in the cart.
 * It must be a descendent of a `CartProvider` component.
 */
export function CartShopPayButton({
  /** A string of classes to apply to the `div` that wraps the `shop-pay-button` web component. */
  className,
}: Omit<ShopPayButtonProps, 'variantIds'>) {
  const {lines} = useCart();

  const ids = useMemo(() => {
    return lines.map((line) => line.merchandise.id);
  }, [lines]);

  return <ShopPayButton className={className} variantIds={ids}></ShopPayButton>;
}
