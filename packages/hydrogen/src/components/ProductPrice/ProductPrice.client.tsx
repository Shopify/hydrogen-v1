import React, {ElementType} from 'react';
import {Money} from '../Money';
import {useProduct} from '../ProductProvider';
import {Props} from '../types';

export interface ProductPriceProps {
  /** The type of price. Valid values: `regular` (default) or `compareAt`. */
  priceType?: 'regular' | 'compareAt';
  /** The type of value. Valid values: `min` (default) or `max`. */
  valueType?: 'max' | 'min';
}

/**
 * The `ProductPrice` component renders a `Money` component with the product
 * [`priceRange`](/api/storefront/reference/products/productpricerange)'s `maxVariantPrice`
 * or `minVariantPrice`, for either the regular price or compare at price range.
 * It must be a descendent of the `ProductProvider` component.
 */
export function ProductPrice<TTag extends ElementType>(
  props: Props<TTag> & ProductPriceProps
) {
  const product = useProduct();
  const {priceType = 'regular', valueType = 'min', ...passthroughProps} = props;

  if (product == null) {
    throw new Error('Expected a ProductProvider context, but none was found');
  }

  let price;

  if (priceType === 'compareAt') {
    if (valueType === 'max') {
      price = product.compareAtPriceRange?.maxVariantPrice;
    } else {
      price = product.compareAtPriceRange?.minVariantPrice;
    }
  } else {
    if (valueType === 'max') {
      price = product.priceRange?.maxVariantPrice;
    } else {
      price = product.priceRange?.minVariantPrice;
    }
  }

  if (price == null) {
    return null;
  }

  return (
    <Money {...passthroughProps} money={price}>
      {props.children}
    </Money>
  );
}
