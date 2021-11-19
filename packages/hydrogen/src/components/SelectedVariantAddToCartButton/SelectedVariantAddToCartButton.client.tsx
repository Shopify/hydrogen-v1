import React from 'react';
import {useProduct} from '../ProductProvider';
import {
  AddToCartButton as CartButton,
  AddToCartButtonProps,
} from '../AddToCartButton';
import {Props} from '../types';

type PropsWeControl = 'disabled';

/**
 * The `SelectedVariantAddToCartButton` component renders a `AddToCartButton` for the product's
 * selected variant. Clicking this button automatically adds the selected variant to the cart.
 * It must be a descendent of a `ProductProvider` and `CartProvider` component.
 */
export function SelectedVariantAddToCartButton<
  TTag extends React.ElementType = 'button'
>(
  props: Props<TTag, PropsWeControl> & Omit<AddToCartButtonProps, 'variantId'>
) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a Product context, but none was found');
  }

  const {children, quantity, attributes, ...passthroughProps} = props;

  return (
    <CartButton
      {...passthroughProps}
      variantId={product.selectedVariant?.id ?? ''}
      quantity={quantity ?? 1}
      disabled={!product.selectedVariant || passthroughProps.disabled}
      attributes={attributes}
    >
      {children}
    </CartButton>
  );
}
