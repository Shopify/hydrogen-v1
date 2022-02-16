import React, {ElementType} from 'react';
import {useProduct} from '../ProductProvider';
import {Money, MoneyProps} from '../Money';
import {Props} from '../types';

export interface SelectedVariantPriceProps extends Omit<MoneyProps, 'data'> {
  /** The type of price. Valid values: `regular` (default) or `compareAt`. */
  priceType?: 'regular' | 'compareAt';
}

/**
 * The `SelectedVariantPrice` component renders a `Money` component for the product's selected variant's price or compare at price.
 * It must be a descendent of a `ProductProvider` component.
 */
export function SelectedVariantPrice<TTag extends ElementType>(
  props: Props<TTag> & SelectedVariantPriceProps
) {
  const product = useProduct();
  const {priceType = 'regular', ...passthroughProps} = props;

  if (product == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  const selectedVariant = product.selectedVariant;

  const price =
    priceType === 'regular'
      ? selectedVariant?.priceV2
      : selectedVariant?.compareAtPriceV2;

  if (price == null) {
    return null;
  }

  return <Money {...passthroughProps} data={price} />;
}
