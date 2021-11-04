import React, {ElementType} from 'react';
import {
  BuyNowButton,
  BuyNowButtonProps,
  BuyNowButtonPropsWeControl,
} from '../BuyNowButton';
import {useProduct} from '../ProductProvider';
import {Props} from '../types';

/**
 * The `SelectedVariantBuyNowButton` component renders a `BuyNowButton` for the product's selected variant.
 * Clicking this button automatically adds the selected variant to the cart and redirect the customer to checkout.
 * It must be a descendent of a `ProductProvider` component.
 */
export function SelectedVariantBuyNowButton<
  TTag extends ElementType = 'button'
>(
  props: Props<TTag, BuyNowButtonPropsWeControl> &
    Omit<BuyNowButtonProps, 'variantId'>
) {
  const product = useProduct();

  if (product == null) {
    throw new Error('Expected a Product context, but none was found');
  }

  const {children, quantity, attributes, ...passthroughProps} = props;

  return (
    <BuyNowButton
      quantity={quantity ?? 1}
      attributes={attributes}
      variantId={product.selectedVariant?.id ?? ''}
      disabled={!product.selectedVariant || passthroughProps.disabled}
      {...passthroughProps}
    >
      {children}
    </BuyNowButton>
  );
}
