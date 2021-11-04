import React from 'react';
import {ShopPayButton, ShopPayButtonProps} from '../ShopPayButton';
import {useProduct} from '../ProductProvider';

/**
 * The `SelectedVariantShopPayButton` component renders a `ShopPayButton` for the product's selected variant.
 * It must be a descendent of a `ProductProvider` component.
 */
export function SelectedVariantShopPayButton({
  /** A string of classes to apply to the `div` that wraps the `shop-pay-button` web component. */
  className,
}: Omit<ShopPayButtonProps, 'variantIds'>) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  const id = product?.selectedVariant?.id;

  return id ? <ShopPayButton className={className} variantIds={[id]} /> : null;
}
